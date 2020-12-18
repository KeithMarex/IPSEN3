import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from "@angular/router";
import {configurationService} from "../../../shared/configuration.service";
import {UserModel} from "../../../shared/models/user.model";
import {Cookie} from 'ng2-cookies/ng2-cookies';

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

        console.log(responseData['result']['id']);
        const m = responseData['result'];
        this.conf.user = new UserModel(m['id'], m['email'], m['permission_group'], m['first_name'], m['last_name']);
        console.log(this.conf.user);
        this.router.navigate([this.router.url + '/dashboard']);
      }
      console.log(responseData);
    });
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
