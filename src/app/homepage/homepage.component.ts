import {Component, OnInit} from '@angular/core';
import {Api} from '../api/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  categories = [];
  collections = [];
  selectedCategoryId : number;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.loadCategories();
    //this.loadCollections();
  }

  private loadCategories()
  {
    const api = Api.getApi();
    api.get('/category/all').then(response => {
      this.categories = response.data.result;
    });
  }

  private loadCollectionsByCat(catId : number) {
    const api = Api.getApi();
    api.get('/collection/all/' + catId).then((response) => {
      this.collections = response.data.result;
      console.log(response.data);
    });
  }

  onSelectCategory(catId : number)
  {
    this.loadCollectionsByCat(catId);
    console.log(catId);
    this.selectedCategoryId = catId;

  }

  goToSelection(collectionID): void {
    this.router.navigate([this.router.url + '/collection/' + collectionID]);
  }

}
