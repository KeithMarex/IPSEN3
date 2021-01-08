import {Component, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Api} from '../../api/api';
import Swal from 'sweetalert2';
import {CollectionModel} from '../../shared/models/collection.model';
import {UserModel} from '../../shared/models/user.model';
import {AnswerModel} from '../../shared/models/answer.model';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {
  private loggedInUser;
  collections: CollectionModel[] = [];
  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty:boolean = true;
  selectedCollections: CollectionModel[] = [];
  selectedCollectionName = '';

  openFirstQuestionModal:boolean = false;
  answerList:AnswerModel[] = [];
  answerListCount:number = 0;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInUser = UserModel.getLoggedInUser();
    this.getOnInitData();
  }

  showWelcomeAlert(): void {
    /*Swal.fire({
      title: 'Welkom ' + this.loggedInUser.firstName + '!',
      timer: 1500,
      showConfirmButton: false,
    });
    */
  }

  async getOnInitData(): Promise<void> {
    if (this.collections.length !== 0) {
      this.collections.length = 0;
    }
    const response = await Api.getApi().get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response): void {
    response.forEach(e => {
      const row = new CollectionModel(e.id, e.name, e.type, e.version);
      this.collections.push(row);
    });

    this.checkCollectionAvailability();
    this.showWelcomeAlert();
  }

  checkCollectionAvailability(): void {
    if (this.collections.length !== 0) {
      this.changeSelectedCollection(this.collections[0]);
    }
  }

  async changeSelectedCollection(col: CollectionModel): Promise<void> {
    this.selectedCollectionIsEmpty = true;
    this.selectedCollections.splice(0);
    this.selectedCollectionName = col.name;
    this.selectedCollection = col;

    const response = await Api.getApi().get('/collection/getAllByName/' + col.name);
    const j = response.data.result;

    for (let i = 0; i < j.length; i++) {
      const r = response.data.result[i];
      this.selectedCollections.push(new CollectionModel(r.id, r.name, r.type, r.version));
    }
  }

  deleteCollection(collection, index): void {
    Swal.fire({
      title: 'Weet je zeker dat je deze boom wilt verwijderen?',
      html: `Je kan deze actie hierna niet meer terugdraaien. <br><br><b>Info</b><br>Titel: ${collection.name} <br>
                Type: ${collection.type} <br> Versie: ${collection.version}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuleren',
      confirmButtonText: 'Verwijder'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // TODO: Api call on succes SWAL fire succes
        const api = Api.getApi();
        const response = await api.post('/collection/delete', {id: collection.id});
        const r = response.data.result;
        await this.getOnInitData();
        if (r) {
          Swal.fire({
            title: 'Boom verwijderd',
            icon: 'success'
          });
          this.selectedCollections.splice(index, 1);
        } else {
          Swal.fire({
            title: 'Het ID is niet bekend',
            text: 'Geselecteerde boom is niet verwijderd.',
            icon: 'error'
          });
        }
      }
    });
  }

  changeStatus(el): void {
    Swal.fire({
      title: 'Kies status',
      text: el.name,
      input: 'radio',
      inputOptions: {
        concept: 'Concept',
        published: 'Published',
        archived: 'Archived'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Je moet iets kiezen!';
        }
      }
    }).then(async (result) => {
      const data = {id: el.id, type: result.value};
      const api = Api.getApi();
      const response = await api.post('/collection/update', data);
      const r = response.data.result;
      if (r) {
        Swal.fire({
          title: 'Collectie succesvol aangepast',
          icon: 'success',
        });
        this.changeSelectedCollection(this.selectedCollection);
      }
    });
  }

  async newCollection(): Promise<void> {
    Swal.fire({
      title: 'Nieuwe collectie naam',
      input: 'text',
      inputLabel: 'Geef een nieuwe collectienaam op',
      inputPlaceholder: 'Collectie naam...'
    }).then(async (result) => {
      const data = {name: result.value};
      const api = Api.getApi();
      const response = await api.post('/collection/create', data);
      await this.getOnInitData();
      if (response.data.result) {
        this.openFirstQuestionModal = true;
        console.log('collection', response);
      } else {
        Swal.fire({
          title: 'Collectie bestaat al',
          text: 'Er is geen nieuwe collectie aangemaakt.',
          icon: 'error',
        });
      }
    });
  }

  editCollection(el: CollectionModel): void {
    this.router.navigate(['admin/collection', { id: el.id }]);
  }

  onClickAddNewAnswer() {
    this.answerList.push(new AnswerModel("answer-" + this.answerListCount.toString(), ''));
    this.answerListCount++;
    console.log(this.answerList);
  }

  async onSubmit(f:NgForm):Promise<void> {

    const question:string = f['question'];
    const type: string = f['type']; // Word dit niet gebruikt?
    
    const questionData = { 
        name: question,
        collection_id: this.selectedCollection.id,
        answer_id: ''
    };

    const api = Api.getApi();

    const response = await api.post('/question/create', questionData);
    
    if(response.data) {
      Object.entries(f).forEach(async e => {

        const [key, value] = e;
        if(key.includes('answer')) {

            const answerData = {
                name: value,
                question_id: response.data.id
            }

            const res = await api.post('/question/create', answerData);
        }
      });
    }

    this.closeFirstQuestionModal();
  }

  closeFirstQuestionModal() {
    this.openFirstQuestionModal = false;
    this.answerList = [];
    this.answerListCount = 0;
  }
}
