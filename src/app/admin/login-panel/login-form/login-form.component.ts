import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  succes = true;

  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  viewPass() {
    this.changeView.emit();
  }

  setWarning(){
    this.succes = false;
  }

  onFormSubmit(postData: {email: string, password: string}){
    this.http.post('https://ipsen3.nielsprins.com/api/user/checkUserCredentials', postData).subscribe(responseData => {
      if (responseData['login'] === 'failed'){
        this.setWarning();
      } else {
        this.router.navigate(['dashboard']);
      }
      console.log(responseData['login']);
    });
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
