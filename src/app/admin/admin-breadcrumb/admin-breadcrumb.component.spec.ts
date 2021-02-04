import { TestBed } from '@angular/core/testing';
import {AdminBreadcrumbComponent} from './admin-breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminBreadcrumbComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AdminBreadcrumbComponent
      ],
    }).compileComponents();
  });

  it(`should have as title 'Dashboard'`, () => {
    const fixture = TestBed.createComponent(AdminBreadcrumbComponent);
    const app = fixture.componentInstance;
    expect(app.home).toEqual('Dashboard');
  });
});
