import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CollectionModel} from '../../../shared/models/collection.model';
import {Api} from '../../../api/api';
import {AnswerModel} from '../../../shared/models/answer.model';
import Swal from 'sweetalert2';
import {NotificationModel} from '../../../shared/models/notification.model';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {

  selectedCollection: CollectionModel = null;
  answers: AnswerModel[] = [];
  firstQuestion: CollectionModel;
  isDataAvailable = false;

  routesNormal = ['Collections'];
  routes = [];

  @ViewChild('notificationTab') nt;
  public notifications: NotificationModel[] = [];

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  // Text editor values
  @ViewChild('textEditor') te;
  currText: any;
  currData: any;
  private res;
  public previousQuestion: string;
  currSelected: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const response = await Api.getApi().get('/collection/' + this.route.snapshot.paramMap.get('collectionId'));
      const firstQuestion = await Api.getApi().get('/question/getByCollection/' + this.route.snapshot.paramMap.get('collectionId'));
      const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
      this.firstQuestion = firstQuestion.data.result;
      const r = response.data.result;
      this.selectedCollection = new CollectionModel(r.id, r.name, r.type, r.version);
      this.routesNormal.push(this.selectedCollection.name);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < answers.data.result.length; i++){
        this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
      }
      this.isDataAvailable = true;
    });
  }

  createAnswer(): void {
    Swal.fire({
      title: 'Wat wil je doen?',
      text: 'Ik wil een nieuw antwoord maken met...',
      icon: 'question',
      showDenyButton: true,
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: 'Een nieuw vervolg',
      denyButtonText: 'Een bestaand vervolg (Koppelen)'
    }).then(async res => {
      if (res.isConfirmed){
        Swal.fire({
          html: `<h1><b>Nieuw antwoord</b></h1>
             <hr>
             <input id="swal-input2" class="swal2-input" placeholder="Vul hier een nieuw antwoord in...">
             <hr>
             <label for="sel1">Vervolg op antwoord</label>
             <select class="form-control" id="sel1">
                <option value="Vraag">Vraag</option>
                <option value="Notificatie">Notificatie</option>
                <option value="Vooraf">Vooraf aangemaakte notificatie</option>
<!--                <option value="Email">Email</option>-->
              </select>
              <br>
        `,
          focusConfirm: false,
          confirmButtonText: 'Oke',
          preConfirm: () => {
            // tslint:disable-next-line:max-line-length
            if ((document.getElementById('swal-input2') as HTMLInputElement).value && (document.getElementById('sel1') as HTMLInputElement).value) {
              return [
                (document.getElementById('swal-input2') as HTMLInputElement).value,
                (document.getElementById('sel1') as HTMLInputElement).value
              ];
            } else {
              Swal.showValidationMessage('Je moet waardes opgeven');
            }
          },
        }).then(async (result) => {
          if (result.isConfirmed && result.value[1] === 'Notificatie') {
            this.res = result;
            this.currText = 'Nieuwe ' + result.value[1].toLowerCase() + ' voor ' + result.value[0];
            this.te.fire();
          } else if (result.value[1] === 'Vooraf'){
            // Todo Keuze menu uit notificaties voor collectie
            this.notifications = [];
            Api.getApi().get('/notification/get/all').then(res => {
              const data = res['data']['result'];
              data.forEach(val => {
                this.notifications.push(new NotificationModel(val.id, val.text));
              });
            });
            this.res = result;
            this.nt.fire();
          } else {
            await Swal.fire({
              inputLabel: 'Nieuwe ' + result.value[1].toLowerCase() + ' voor ' + result.value[0],
              input: 'text',
              inputPlaceholder: 'Vul een nieuwe vraag in',
              showCancelButton: true,
              confirmButtonText: 'Oke',
              cancelButtonText: 'Annuleren',
              inputValidator: (value) => {
                if (!value) {
                  return 'Je moet iets opgeven!';
                }
              }
            }).then(async (result2) => {
              if (result2.isConfirmed && result2.value) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Antwoord aangemaakt'
                });

                const response = await Api.getApi().post('/answer/create', {
                  name: result.value[0],
                  question_id: this.firstQuestion['id']
                });
                const r = response.data;

                const response2 = await Api.getApi().post('/question/create', {
                  name: result2.value,
                  answer_id: r.id
                });

                this.answers.push(new AnswerModel(r.id, result.value[0]));
              }
            });
          }
        });
      } else if (res.isDenied){
        const json = {};
        const idLijst = [];
        for (const i of this.answers){
          if (!i.hasNotification){
            await Api.getApi().get('/question/getByAnswer/' + i.id).then(res => {
              if (!idLijst.includes(res.data.result.id)){
                json[res.data.result.id] = res.data.result.name;
                idLijst.push(res.data.result.id);
              }
            });
          }
        }

        Swal.fire({
          title: 'Kies een vervolg vraag',
          input: 'select',
          inputOptions: json,
          showDenyButton: false,
          confirmButtonText: `Kies`,
          showCloseButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Je moet een categorie selecteren!';
            }
          }
        }).then(rest => {
          Swal.fire({
            title: 'Vul een nieuwe antwoord in',
            input: 'text',
          }).then(async result => {
            if (result.isConfirmed){
              this.Toast.fire({
                icon: 'success',
                title: 'Antwoord aangemaakt'
              });

              const response = await Api.getApi().post('/answer/create', {
                name: result.value,
                question_id: this.firstQuestion['id']
              });
              const r = response.data;

              // ToDo link

              Api.getApi().post('/question/link', {
                question_id: rest.value,
                answer_id: r.id
              }).then( () => {
                this.answers.push(new AnswerModel(r.id, result.value));
              });
            }
          });
        });
      }
    });
  }

  async removeAnswer(el: AnswerModel, i: number): Promise<void> {
    Swal.fire({
      title: 'Weet je het zeker dat je dit wilt verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Bevestigen',
      cancelButtonText: 'Annuleren'
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            title: 'Er heeft zich een fout voorgedaan',
            text: r
          });
        }

      }
    });
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
    this.routes.push(this.firstQuestion);

    this.answers.splice(0);
    const firstQuestion = await Api.getApi().get('/question/getByAnswer/' + el.id);
    this.firstQuestion = firstQuestion.data.result;

    const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < answers.data.result.length; i++){
      this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
    }
  }

  async textEditorFunc(): Promise<void> {
    this.Toast.fire({
      icon: 'success',
      title: 'Antwoord aangemaakt'
    });

    const response = await Api.getApi().post('/answer/create', {
      name: this.res.value[0],
      question_id: this.firstQuestion['id']
    });
    const r = response.data;

    const response2 = await Api.getApi().post('/notification/create', {
      text: this.currData,
      answer_id: r.id
    });

    console.log(this.currData);
    this.answers.push(new AnswerModel(r.id, this.res.value[0]));
  }

  async goTo($event: CollectionModel): Promise<void> {
    this.answers.splice(0);
    this.firstQuestion = $event;

    const answers = await Api.getApi().get('/answer/getByQuestion/' + $event.id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < answers.data.result.length; i++) {
      this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
    }
  }

  onChange(deviceValue): void {
    console.log(deviceValue);
    this.nt.delete();
  }

  async newNotification(): Promise<void> {
    this.Toast.fire({
      icon: 'success',
      title: 'Antwoord aangemaakt'
    });

    const response = await Api.getApi().post('/answer/create', {
      name: this.res.value[0],
      question_id: this.firstQuestion['id']
    });
    const r = response.data;

    const response2 = await Api.getApi().post('/notification/link', {
      notificationId: this.currSelected,
      answerId: r.id
    });

    this.answers.push(new AnswerModel(r.id, this.res.value[0]));
  }
}
