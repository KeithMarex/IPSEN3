import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormComponent } from './login-form.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('LoginFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        LoginFormComponent
      ],
    }).compileComponents();
  });

  it(`API werkt met simpele inlog methode`, () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const app = fixture.componentInstance;
    expect(app.checkLogin('admin', 'admin')).toEqual(true);
  });
});
