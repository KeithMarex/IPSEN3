import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CollectionModel} from '../../../shared/models/collection.model';
import {Api} from '../../../api/api';
import {AnswerModel} from '../../../shared/models/answer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {

  selectedCollection: CollectionModel = null;
  answers: AnswerModel[] = [];
  firstQuestion: string;
  isDataAvailable = false;

  routes = ['Collections'];

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const response = await Api.getApi().get('/collection/' + this.route.snapshot.paramMap.get('collectionId'));
      const firstQuestion = await Api.getApi().get('/question/getByCollection/' + this.route.snapshot.paramMap.get('collectionId'));
      const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
      this.firstQuestion = firstQuestion.data.result;
      const r = response.data.result;
      this.selectedCollection = new CollectionModel(r.id, r.name, r.type, r.version);
      this.routes.push(this.selectedCollection.name);
      for (let i = 0; i < answers.data.result.length; i++) {
        this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
      }
      this.isDataAvailable = true;
    });
  }

  async createAnswer(): Promise<void> {
    await Swal.fire({
      html: `<h1><b>Nieuw</b></h1>
             <hr>
             <label for="swal-input2">Nieuw antwoord</label>
             <input id="swal-input2" class="swal2-input">
             <hr>
             <label for="sel1">Nieuw vervolg</label>
             <select class="form-control" id="sel1">
                <option value="Vraag">Vraag</option>
                <option value="Notificatie">Notificatie</option>
                <option value="Email">Email</option>
              </select>
        `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('sel1') as HTMLInputElement).value
        ];
      }
    }).then(async (result) => {
      await Swal.fire({
        input: 'textarea',
        inputLabel: 'Nieuwe ' + result.value[1].toLowerCase() + ' voor ' + result.value[0],
        inputPlaceholder: 'Type je boodschap hier...',
        inputAttributes: {
          'aria-label': 'Type your message here'
        },
        showCancelButton: true
      }).then(async (result2) => {
        const response = await Api.getApi().post('/answer/create', {
          name: result.value[0],
          question_id: this.firstQuestion['id']
        });
        const r = response.data;

        const response2 = await Api.getApi().post('/question/create', {
          name: result2.value,
          answer_id: r.id
        });
        const d = response2.data;
        console.log(response2);

        if (result2.isConfirmed) {
          this.answers.push(new AnswerModel(r.id, result.value[0]));
          await this.Toast.fire({
            icon: 'success',
            title: 'Antwoord aangemaakt'
          });
        }
        else if (result.isConfirmed) {
          await this.Toast.fire({
            icon: 'error',
            title: 'Er heeft zich een fout voorgedaan'
          });
        }
      });
    });
  }

  async removeAnswer(el: AnswerModel, i: number): Promise<void> {
    const response = await Api.getApi().post('/answer/delete', {id: el.id});
    const r = response.data;
    if (r.result){
      this.answers.splice(i, 1);
      await this.Toast.fire({
        icon: 'success',
        title: 'Antwoord verwijderd'
      });
    } else {
      await this.Toast.fire({
        icon: 'error',
        title: 'Er heeft zich een fout vergedaan',
        text: r
      });
    }
  }

  async editAnswer(el: AnswerModel, i): Promise<void> {
    await Swal.fire({
      html: `<h1><b>Aanpassen</b></h1>
             <h3>${el.name}</h3>
             <hr>
             <label for="swal-input2">Verander antwoord</label>
             <input id="swal-input2" class="swal2-input">
        `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ];
      }
    }).then(async (result) => {
      const response = await Api.getApi().post('/answer/update', {id: el.id, name: result.value[0]});
      const r = response.data;
      if (r.result){
        this.answers[i].name = result.value[0];
        await this.Toast.fire({
          icon: 'success',
          title: 'Antwoord aangepast'
        });
      } else {
        await this.Toast.fire({
          icon: 'error',
          title: 'Er heeft zich een fout vergedaan',
          text: r
        });
      }
    });
  }

  async nextQuestion(el: AnswerModel): Promise<void> {
    this.answers.splice(0);
    const firstQuestion = await Api.getApi().get('/question/getByAnswer/' + el.id);
    this.firstQuestion = firstQuestion.data.result;

    const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
    for (let i = 0; i < answers.data.result.length; i++){
      this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
    }
  }
}
