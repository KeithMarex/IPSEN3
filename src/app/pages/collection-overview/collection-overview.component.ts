import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import api from '../../api/base-url';
import {configurationService} from '../../shared/configuration.service';
import Swal from 'sweetalert2';
import {CollectionModel} from 'src/app/shared/models/collection.model';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty = true;


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

  convertDataToObject(response): void {
    response.forEach(e => {
      const row = {id: e.id, name: e.name, type: e.type, version: e.version};
      console.log(row);
      this.conf.collections.push(new CollectionModel(e.id, e.name, e.type, e.version));
    });
    this.checkCollectionAvailability();
  }

  checkCollectionAvailability(): void {
    if (this.conf.collections.length !== 0) {
      this.selectedCollection = this.conf.collections[0];
      this.selectedCollectionIsEmpty = false;
    }
  }

  changeSelectedCollection(col: CollectionModel): void {
    this.selectedCollection = col;
    console.log(this.selectedCollection);
  }

  deleteCollection(): void {
    Swal.fire({
      title: 'Weet je zeker dat je deze boom wilt verwijderen?',
      html: 'Je kan deze actie hierna niet meer terugdraaien. <br><br><b>Info</b><br>Titel: ... <br>Status: ... <br> Versie: ...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuleren',
      confirmButtonText: 'Verwijder'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Api call on succes SWAL fire succes
        Swal.fire({
          title: 'Boom verwijderd',
          icon: 'success'
        });
      }
    });
  }
}
