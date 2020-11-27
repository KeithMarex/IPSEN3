import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { AdminBreadcrumbComponent } from './admin-breadcrumb/admin-breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminNavigationComponent,
    AdminBreadcrumbComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
