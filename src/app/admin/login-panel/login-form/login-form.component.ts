import {Component, ErrorHandler, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  viewPass() {
    this.changeView.emit();
  }

  onFormSubmit(postData: {email: string, password: string}){
    this.http.post('https://ipsen3.nielsprins.com/api/user/checkUserCredentials', postData).subscribe(responseData => {console.log(responseData);});
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
