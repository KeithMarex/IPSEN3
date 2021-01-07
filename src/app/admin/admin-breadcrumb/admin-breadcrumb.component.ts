import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-admin-breadcrumb',
  templateUrl: './admin-breadcrumb.component.html',
  styleUrls: ['./admin-breadcrumb.component.scss']
})
export class AdminBreadcrumbComponent implements OnInit {

  @Input() home = 'Dashboard';
  @Input() active = [];


  constructor() { }

  ngOnInit(): void {
  }

}
