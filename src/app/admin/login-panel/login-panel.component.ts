import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnInit {
  currentView = 'login';

  constructor() { }

  ngOnInit(): void {
  }

}