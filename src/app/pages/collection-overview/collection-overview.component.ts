import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import api from '../../api/base-url';
import {configurationService} from "../../shared/configuration.service";
import Swal from "sweetalert2";
import {CollectionModel} from "../../shared/models/collection.model";

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty = true;
  selectedCollections: CollectionModel[] = [];
  selectedCollectionName = '';


  constructor(public conf: configurationService) {
  }

  ngOnInit(): void {
    this.getOnInitData();
    this.showWelcomeAlert();
  }

  showWelcomeAlert(): void {
    // tslint:disable-next-line:prefer-const
    let timerInterval;
    Swal.fire({
      title: 'Welkom ' + this.conf.user.firstName + '!',
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

  onClickOpenModalChangeStatus(col: CollectionModel) {
    console.log('test', col);
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
}
