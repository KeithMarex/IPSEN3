import {Component, OnInit} from '@angular/core';
import {Api} from '../api/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  collections = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const api = Api.getApi();
    api.get('/collection/all').then((response) => {
      this.collections = response.data.result;
    });
  }

  goToSelection(collectionID): void {
    this.router.navigate([this.router.url + '/collection/' + collectionID]);
  }

}
