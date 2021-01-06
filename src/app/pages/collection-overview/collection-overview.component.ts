import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import api from '../../api/base-url';
import {ConfigurationService} from "../../shared/configuration.service";
import Swal from "sweetalert2";
import {CollectionModel} from "../../shared/models/collection.model";
import {UserModel} from '../../shared/models/user.model';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {
  private loggedInUser;
  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty = true;
  selectedCollections: CollectionModel[] = [];
  selectedCollectionName = '';


  constructor(public conf: ConfigurationService) {
    this.loggedInUser = UserModel.getLoggedInUser();
  }

  ngOnInit(): void {
    this.getOnInitData();
    this.showWelcomeAlert();
  }

  showWelcomeAlert(): void {
    let timerInterval;
    Swal.fire({
      title: 'Welkom ' + this.loggedInUser.firstName + '!',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  }

  async getOnInitData(): Promise<void> {
    const response = await api.get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response) {
    response.forEach(e => {
      const row = new CollectionModel(e.id, e.name, e.type, e.version);
      this.conf.collections.push(row);
    });

    this.checkCollectionAvailability();
  }

  checkCollectionAvailability(): void {
    if(this.conf.collections.length !== 0) {
      this.changeSelectedCollection(this.conf.collections[0]);
    }
  }

  async changeSelectedCollection(col: CollectionModel) {
    this.selectedCollectionIsEmpty = true;
    this.selectedCollections.splice(0);
    this.selectedCollectionName = col.name;
    this.selectedCollection = col;

    const response = await api.get('/collection/getAllByName/' + col.name);
    const j = response.data.result;

    for (let i = 0; i < j.length; i++){
      const r = response.data.result[i];
      this.selectedCollections.push(new CollectionModel(r['id'], r['name'], r['type'], r['version']));
    }
  }

  deleteCollection(collection, index): void {
    Swal.fire({
      title: 'Weet je zeker dat je deze boom wilt verwijderen?',
      html: "Je kan deze actie hierna niet meer terugdraaien. <br><br><b>Info</b><br>Titel: " + collection.name + " <br>Type: " + collection.type + " <br> Versie: " + collection.version,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuleren',
      confirmButtonText: 'Verwijder'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // TODO: Api call on succes SWAL fire succes
        const response = await api.post('/collection/delete', {id: collection.id});
        const r = response.data.result;
        if (r){
          Swal.fire({
            title: 'Boom verwijderd',
            icon: "success"
          })
          this.selectedCollections.splice(index, 1);
        } else {
          Swal.fire({
            title: 'Het ID is niet bekend',
            text: 'Geselecteerde boom is niet verwijderd.',
            icon: "error"
          })
        }
      }
    })
  }

  changeStatus(el) {
    Swal.fire({
      title: 'Kies status',
      text: el.name,
      input: 'radio',
      inputOptions: {
              'concept': 'Concept',
              'published': 'Published',
              'archived': 'Archived'
            },
      inputValidator: (value) => {
        if (!value) {
          return 'Je moet iets kiezen!'
        }
      }
    }).then(async (result) => {
      const data = {id: el.id, type: result.value};
      const response = await api.post('/collection/update', data);
      const r = response.data.result;
      if (r){
        Swal.fire({
          title: 'Collectie succesvol aangepast',
          icon: "success"
        })
        this.changeSelectedCollection(this.selectedCollection);
      }
    })
  }
}
