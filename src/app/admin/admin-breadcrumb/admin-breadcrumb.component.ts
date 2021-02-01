import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {CollectionModel} from '../../shared/models/collection.model';

@Component({
  selector: 'app-admin-breadcrumb',
  templateUrl: './admin-breadcrumb.component.html',
  styleUrls: ['./admin-breadcrumb.component.scss']
})
export class AdminBreadcrumbComponent implements OnInit {

  @Input() home = 'Dashboard';
  @Input() activeNormal = [];
  @Input() active = [];
  @Output() goToQ = new EventEmitter<CollectionModel>();


  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  goToDashboard(): void {
    this.route.navigate(['admin/dashboard']);
  }

  goTo(i: CollectionModel, index: number): void {
    this.goToQ.emit(i);
    this.active.splice(index + 1);
  }
}
