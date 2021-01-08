import {Component, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-breadcrumb',
  templateUrl: './admin-breadcrumb.component.html',
  styleUrls: ['./admin-breadcrumb.component.scss']
})
export class AdminBreadcrumbComponent implements OnInit {

  @Input() home = 'Dashboard';
  @Input() active = [];


  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  goToDashboard(): void {
    this.route.navigate(['admin/dashboard']);
  }
}
