import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import api from '../../../api/api';
import {CollectionModel} from '../../../shared/models/collection.model';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {

  selectedCollection: CollectionModel = null;
  isDataAvailable = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const response = await api.get('/collection/' + this.route.snapshot.paramMap.get('id'));
      const r = response.data.result;
      this.selectedCollection = new CollectionModel(r.id, r.name, r.type, r.version);
      this.isDataAvailable = true;
    });
  }

}
