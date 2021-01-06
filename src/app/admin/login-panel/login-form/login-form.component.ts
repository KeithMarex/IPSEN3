import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserModel} from '../../../shared/models/user.model';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import api from '../../../api/base-url';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  success = true;

  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    const user = UserModel.getLoggedInUser();
    if (user) {
      this.router.navigate([this.router.url + '/dashboard']);
    }
  }

  viewPass(): void {
    this.changeView.emit();
  }

  onFormSubmit(postData: { email: string, password: string }): void {
    api.post('/user/checkUserCredentials', postData).then((response) => {
      if (response.data.login !== 'success') {
        this.success = false;
      } else {
        Cookie.set('token', response.data.token, 7);
        this.router.navigate([this.router.url + '/dashboard']);
      }
    });
  }
}
