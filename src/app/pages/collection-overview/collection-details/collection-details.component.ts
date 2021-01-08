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
      const response = await Api.getApi().get('/collection/' + this.route.snapshot.paramMap.get('id'));
      const firstQuestion = await Api.getApi().get('/question/getByCollection/' + this.route.snapshot.paramMap.get('id'));
      const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
      this.firstQuestion = firstQuestion.data.result;
      const r = response.data.result;
      this.selectedCollection = new CollectionModel(r.id, r.name, r.type, r.version);
      this.routes.push(this.selectedCollection.name);
      for (let i = 0; i < answers.data.result.length; i++){
        this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
      }
      this.isDataAvailable = true;
    });
  }

  createAnswer(): void {
    Swal.fire({
      title: 'Nieuw antwoord',
      html: 'Geef hieronder een nieuw antwoord op voor de vraag: <b>' + this.firstQuestion['name'] + '</b>',
      input: 'text',
      showCancelButton: true,
      cancelButtonText: 'Annuleren',
      inputValidator: (value) => {
        if (!value) {
          return 'Je moet een naam opgeven';
        }
      }
    }).then(async (result) => {
      const response = await Api.getApi().post('/answer/create', {name: result.value, question_id: this.firstQuestion['id']});
      const r = response.data;
      if (r.result && result.isConfirmed){
        this.answers.push(new AnswerModel(r.id, result.value));
        await this.Toast.fire({
          icon: 'success',
          title: 'Antwoord aangemaakt'
        });
      } else if (!r.result && result.isConfirmed) {
        await this.Toast.fire({
          icon: 'error',
          title: 'Er heeft zich een fout voorgedaan'
        });
      }
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
}
