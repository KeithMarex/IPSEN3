import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {Api} from '../../../api/api';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {
  @Output() changeView = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  viewLogin(): void {
    this.changeView.emit();
  }

  onFormSubmit(postData: { email: string }): void {
    console.log(postData);
    const api = Api.getApi();
    api.post('/user/resetPassword', postData).then((responseData) => {
      console.log(responseData);
      if (responseData.data.result === true) {
        Swal.fire({
          icon: 'success',
          title: 'Wachtwoord aangevraagd!',
          text: 'Controleer je email'
        });
        this.changeView.emit();
      }
    });
  }
}
