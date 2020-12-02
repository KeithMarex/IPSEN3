import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {
  @Output() changeView = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  viewLogin() {

    this.changeView.emit();
  }
}
