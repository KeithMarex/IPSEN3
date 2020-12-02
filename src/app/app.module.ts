import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdminNavigationComponent } from './admin/admin-navigation/admin-navigation.component';
import { AdminBreadcrumbComponent } from './admin/admin-breadcrumb/admin-breadcrumb.component';
import { AdminComponent } from './admin/admin.component';
import { LoginPanelComponent } from './admin/login-panel/login-panel.component';
import { CustomerComponent } from './customer/customer.component';
import { QuestionComponent } from './customer/question/question.component';
import { CustomNavigationComponent } from './customer/question/custom-navigation/custom-navigation.component';
<<<<<<< HEAD
import { CollectionOverviewComponent } from './pages/collection-overview/collection-overview.component';
=======
import { PasswordForgotComponent } from './admin/login-panel/password-forgot/password-forgot.component';
import { LoginFormComponent } from './admin/login-panel/login-form/login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
>>>>>>> 35103cafce4db8b4552f4328d536c7e3c04d9c08

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AdminNavigationComponent,
    AdminBreadcrumbComponent,
    LoginPanelComponent,
    CustomerComponent,
    QuestionComponent,
    CustomNavigationComponent,
<<<<<<< HEAD
    CollectionOverviewComponent
=======
    PasswordForgotComponent,
    LoginFormComponent
>>>>>>> 35103cafce4db8b4552f4328d536c7e3c04d9c08
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
