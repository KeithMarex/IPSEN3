import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {
  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  viewLogin() {
    this.changeView.emit();
  }

  onFormSubmit(postData: {email: string}) {
    console.log(postData);
    this.http.post('https://ipsen3api.nielsprins.com/user/resetPassword', postData).subscribe(responseData => {
      console.log(responseData);
      if (responseData['result'] === true){
        Swal.fire({
          icon: "success",
          title: 'Wachtwoord aangevraagd!',
          text: 'Controleer je email'
        })
        this.changeView.emit();
      }
    });
  }
}
