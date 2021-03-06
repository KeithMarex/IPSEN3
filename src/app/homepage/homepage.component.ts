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
  }

  private loadCategories()
  {
    const api = Api.getApi();
    api.get('/category/all').then(response => {
      this.categories = response.data.result;
    });
  }

  private loadCollectionsByCat(catId: number): void {
    const api = Api.getApi();
    api.post('/collection/all', { categoryId: catId, type: 'published'}).then((response) => {
      this.collections = response.data.result;
    });
  }

  onSelectCategory(catId : number)
  {
    this.loadCollectionsByCat(catId);
    this.selectedCategoryId = catId;

  }

  goToSelection(collectionID): void {
    this.router.navigate([this.router.url + '/collection/' + collectionID]);
  }

}
