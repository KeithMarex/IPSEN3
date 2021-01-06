import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import api from '../../api/base-url';
import {configurationService} from "../../shared/configuration.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  collections = [{id: 'test', name: 'haha', type: 'concept', version: 1}];

  constructor(private conf: configurationService) { }

  ngOnInit(): void {
    this.getTestData();
  }

  async getTestData() {
    const response = await api.get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response) {
    let timerInterval
    Swal.fire({
      title: 'Welkom ' + this.conf.user.voornaam + '!',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval)
      }
    })

    response.forEach(e => {
      const row = { id: e.id, name: e.name, type: e.type, version: e.version }
      this.collections.push(row);
    });
  }
}
