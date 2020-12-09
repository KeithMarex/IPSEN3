import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() changeView = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  viewPass() {
    this.changeView.emit();
  }
}
