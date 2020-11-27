import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { LoginPanelComponent } from './admin/login-panel/login-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginPanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
