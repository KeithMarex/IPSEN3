import { TestBed } from '@angular/core/testing';
import { CollectionOverviewComponent } from './collection-overview.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CollectionOverviewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CollectionOverviewComponent
      ],
    }).compileComponents();
  });

});
