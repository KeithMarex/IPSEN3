import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from "@angular/router";
import api from '../../api/base-url';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  collections = [{id: 'test', name: 'haha', type: 'concept', version: 1}];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getTestData();
  }

  async getTestData() {
    const response = await api.get('/collection/all');
    this.convertDataToObject(response.data.result);
  }

  convertDataToObject(response) {
    response.forEach(e => {
      const row = { id: e.id, name: e.name, type: e.type, version: e.version }
      this.collections.push(row);
    });
  }
}
