import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import api from '../../api/base-url';
import { configurationService } from "../../shared/configuration.service";
import Swal from "sweetalert2";
import { CollectionModel } from 'src/app/shared/models/collection.model';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  selectedCollection: CollectionModel;
  selectedCollectionIsEmpty: boolean = true;


  constructor(private conf: configurationService) { }

  ngOnInit(): void {
    this.getOnInitData();
    this.showWelcomeAlert();
  }

  showWelcomeAlert() {
    let timerInterval
    Swal.fire({
      title: 'Welkom ' + this.conf.user.voornaam + '!',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval)
      }
    })
  }

  async getOnInitData() {
    const response = await api.get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response) {
    response.forEach(e => {
      const row = { id: e.id, name: e.name, type: e.type, version: e.version }
      console.log(row);
      this.conf.collections.push(new CollectionModel(e.id, e.name, e.type, e.version));
    });
    this.checkCollectionAvailability();
  }

  checkCollectionAvailability() {
    if(this.conf.collections.length != 0) {
      this.selectedCollection = this.conf.collections[0];
      this.selectedCollectionIsEmpty = false;
    }
  }

  changeSelectedCollection(col: CollectionModel) {
    this.selectedCollection = col;
  }
}
