import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Api} from '../../api/api';
import Swal from 'sweetalert2';
import {CollectionModel} from '../../shared/models/collection.model';
import {UserModel} from '../../shared/models/user.model';
import {AnswerModel} from '../../shared/models/answer.model';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {CategoryModel} from '../../shared/models/category.model';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {
  private loggedInUser;
  collections: CollectionModel[] = [];
  categorien: CategoryModel[] = [];
  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty = true;
  selectedCollections: CollectionModel[] = [];
  selectedCollectionName = '';

  // Linker balk
  selectedIndex;
  collectionsFromCategory: CollectionModel[] = [];

  newCollectionId;

  openFirstQuestionModal = false;
  answerList: AnswerModel[] = [];
  answerListCount = 0;

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  private selectedCategory: CategoryModel;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInUser = UserModel.getLoggedInUser();
    this.getOnInitData();
  }

  async getOnInitData(): Promise<void> {
    if (this.collections.length !== 0) {
      this.collections = [];
    }

    if (this.categorien.length !== 0) {
      this.categorien = [];
    }

    const categorie = await Api.getApi().get('/category/all');
    categorie.data.result.forEach(e => {
      this.categorien.push(new CategoryModel(e.id, e.name, e.icon));
    });

    const response = await Api.getApi().get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response): void {
    response.forEach(e => {
      const row = new CollectionModel(e.id, e.name, e.type, e.version);
      this.collections.push(row);
    });

    this.checkCollectionAvailability();
  }

  checkCollectionAvailability(): void {
    if (this.collections.length !== 0) {
      this.changeSelectedCollection(this.collections[0]);
    }
  }

  async chooseCategory(el: CategoryModel, index): Promise<void> {
    if (el !== undefined){
      this.collectionsFromCategory.splice(0);
      this.selectedCategory = el;

      this.selectedIndex = index;

      const response = await Api.getApi().get('/collection/all/' + el.id);
      const j = response.data.result;

      for (let i = 0; i < j.length; i++) {
        const r = response.data.result[i];
        this.collectionsFromCategory.push(new CollectionModel(r.id, r.name, r.type, r.version));
      }
    }
  }

  async changeSelectedCollection(col: CollectionModel): Promise<void> {
    this.selectedCollections.splice(0);
    this.selectedCollectionName = col.name;

    if (this.selectedCollection !== undefined && this.selectedCollection.id !== col.id){
      // Doe niks
    }

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
          this.getOnInitData();
          this.chooseCategory(this.selectedCategory, this.selectedIndex);
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

  changeStatus(el, index): void {
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
        this.changeSelectedCollection(el);
      }
    });
  }

  cloneCollection(collection): void {
    const api = Api.getApi();
    api.post('/collection/copy', {copy_collection_id: collection.id}).then((response) => {
      if (response.data.result) {
        collection.id = response.data.id;
        this.getOnInitData();
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
      const json = {};
      const categorie = await Api.getApi().get('/category/all');
      categorie.data.result.forEach(f => {
        json[f.id] = f.name;
      });

      Swal.fire({
        title: 'Kies een categorie',
        input: 'select',
        inputOptions: json,
        showDenyButton: true,
        confirmButtonText: `Kies`,
        showCloseButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Je moet een categorie selecteren!';
          }
        }
      }).then(async a => {
        if (a.isConfirmed){
          const response = await Api.getApi().post('/collection/create', {name: result.value});
          this.newCollectionId = response.data.id;
          const resp = await Api.getApi().post('/link/add/category-to-collection/', {category_id: a.value, collection_id: response.data.id});
          if (resp.data.result){
            this.Toast.fire({
              icon: 'success',
              title: 'Collectie is aangemaakt!'
            });
            this.openFirstQuestionModal = true;
            this.getOnInitData();
            this.chooseCategory(this.selectedCategory, this.selectedIndex);
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Deze collectie bestaat al!'
            });
          }
        }
      });
    });
  }

  editCollection(el: CollectionModel): void {
    this.router.navigate(['admin/collection/' + el.id]);
  }

  async onSubmit(f: NgForm): Promise<void> {
    const question: string = f['question'];
    const type: string = f['type']; // Word dit niet gebruikt?

    const questionData = {
        name: question,
        collection_id: this.newCollectionId
    };

    const api = Api.getApi();
    const post = await api.post('/question/create', questionData);

    console.log(post);

    this.closeFirstQuestionModal();

    if (post.data.result){
      await this.Toast.fire({
        icon: 'success',
        title: 'Niewe collectie succesvol aangemaakt'
      });
    } else {
      await this.Toast.fire({
        icon: 'error',
        title: 'Er is iets fout gegaan'
      });
    }

  }

  closeFirstQuestionModal() {
    this.openFirstQuestionModal = false;
    this.answerList = [];
    this.answerListCount = 0;
  }

  liveViewClicked(): void {
    this.router.navigate([this.router.url + '/live/' + this.selectedCollection.id]);
  }

  newCategory(): void {
    Swal.fire({
      title: 'Wat wil je doen?',
      showDenyButton: true,
      confirmButtonText: `Maak een nieuwe categorie`,
      denyButtonText: `Wijzig een categorie`,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Een nieuwe categorie',
          html: '<label for="swal-input1">Naam</label>' +
            '<input id="swal-input1" class="swal2-input">' +
            '<label for="swal-input2" type="text">Icoon URL</label>' +
            '<input id="swal-input2" class="swal2-input">',
          confirmButtonText: 'Maak',
          preConfirm: () => {
            return [
              (document.getElementById('swal-input1') as HTMLInputElement).value,
              (document.getElementById('swal-input2') as HTMLInputElement).value,
            ];
          }
        }).then((result2) => {
          if (result2.isConfirmed){
            Api.getApi().post('/category/create', {name: result2.value[0], icon: result2.value[1]}).then((response) => {
              if (response.data.result) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Nieuwe categorie succesvol aangemaakt'
                });
                this.getOnInitData();
              }
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Wat wil je met een categorie doen?',
          showDenyButton: true,
          confirmButtonText: `Verander een categorie`,
          denyButtonText: `Verwijder een categorie`,
          showCloseButton: true,
        }).then(async e => {
          if (e.isConfirmed){
            const json = {};
            const categorie = await Api.getApi().get('/category/all');
            categorie.data.result.forEach(f => {
              json[f.id] = f.name;
            });

            Swal.fire({
              title: 'Kies een categorie',
              input: 'select',
              inputOptions: json,
              showDenyButton: true,
              confirmButtonText: `Kies`,
              showCloseButton: true,
            }).then(g => {
              if (g.isConfirmed){
                Swal.fire({
                  title: 'Vul een nieuwe naam in voor de collectie',
                  input: 'text',
                  inputLabel: 'Nieuwe naam',
                  showCancelButton: true,
                  inputValidator: (value) => {
                    if (!value) {
                      return 'You need to write something!';
                    }
                  }
                }).then(async h => {
                  if (h.isConfirmed){
                    const resp = await Api.getApi().post('/category/update', {id: g.value, name: h.value});
                    if (resp.data.result){
                      this.Toast.fire({
                        icon: 'success',
                        title: 'Succesvol aangepast!'
                      });
                      this.getOnInitData();
                    } else {
                      this.Toast.fire({
                        icon: 'error',
                        title: 'Er is iets fout gegaan.'
                      });
                    }
                  }
                });
              }
            });
          } else if (e.isDenied) {
            const json = {};
            const categorie = await Api.getApi().get('/category/all');
            categorie.data.result.forEach(f => {
              json[f.id] = f.name;
            });
            Swal.fire({
              title: 'Kies een categorie',
              input: 'select',
              inputOptions: json,
              showCancelButton: true,
              cancelButtonText: 'Annuleren',
              confirmButtonText: `Verwijder`,
              showCloseButton: true,
            }).then(async j => {
              const resp = await Api.getApi().post('/category/delete', {id: j.value});
              if (resp.data.result){
                this.Toast.fire({
                  icon: 'success',
                  title: 'Succesvol aangepast!'
                });
                this.getOnInitData();
              } else {
                this.Toast.fire({
                  icon: 'error',
                  title: 'Er is iets fout gegaan.'
                });
              }
            });
          }
        });
      }
    });
  }
}
