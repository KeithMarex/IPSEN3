import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Api} from '../../api/api';
import Swal from 'sweetalert2';
import {CollectionModel} from '../../shared/models/collection.model';
import {UserModel} from '../../shared/models/user.model';
import {Router} from '@angular/router';

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
  selectedCollectionIsEmpty = true;
  selectedCollections: CollectionModel[] = [];
  selectedCollectionName = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInUser = UserModel.getLoggedInUser();
    this.getOnInitData();
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
        Swal.fire({
          title: 'Collectie aangemaakt',
          icon: 'success',
        });
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
}
