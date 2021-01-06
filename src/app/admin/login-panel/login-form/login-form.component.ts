import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from "@angular/router";
import {configurationService} from "../../../shared/configuration.service";
import {UserModel} from "../../../shared/models/user.model";
import {Cookie} from 'ng2-cookies/ng2-cookies';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  succes = true;

  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient, private router: Router, private conf: configurationService) { }

  ngOnInit(): void {
    let email = Cookie.get('email');
    let password = Cookie.get('password');
    if (email !== '' && password !== '') {
      const data = {email: email, password: password}
      this.http.post('https://ipsen3api.nielsprins.com/user/checkUserCredentials', data).subscribe(responseData => {
        if (responseData['login'] === 'success') {
          const m = responseData['result'];
          this.conf.user = new UserModel(m['id'], m['email'], m['permission_group'], m['first_name'], m['last_name']);
          let timerInterval
          Swal.fire({
            title: 'Inloggegevens gevonden',
            timer: 1000,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {this.router.navigate([this.router.url + '/dashboard'])})
        }
      })
    }
  }

  viewPass() {
    this.changeView.emit();
  }

  setWarning(){
    this.succes = false;
  }

  onFormSubmit(postData: {email: string, password: string}){
    this.http.post('https://ipsen3api.nielsprins.com/user/checkUserCredentials', postData).subscribe(responseData => {
      if (responseData['login'] !== 'success'){
        this.setWarning();
      } else {

        Cookie.set('api_token', responseData['token'], 7);
        Cookie.set('email', postData.email, 7);
        Cookie.set('password', postData.password, 7);

        const m = responseData['result'];
        this.conf.user = new UserModel(m['id'], m['email'], m['permission_group'], m['first_name'], m['last_name']);
        this.router.navigate([this.router.url + '/dashboard']);
      }
    });
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
