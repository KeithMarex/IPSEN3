import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CollectionModel } from 'src/app/shared/models/collection.model';

@Component({
  selector: 'app-collection-versions',
  templateUrl: './collection-versions.component.html',
  styleUrls: ['./collection-versions.component.scss']
})
export class CollectionVersionsComponent implements OnInit {

  @Input('selectedCollection') selectedCollection: CollectionModel;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
