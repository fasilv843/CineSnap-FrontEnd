/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { UserLoginComponent } from './components/user/user-login/user-login.component'
import { UserRegisterComponent } from './components/user/user-register/user-register.component'
import { UserRoutingModule } from './components/user/user.routing';
import { UserHomeComponent } from './components/user/user-home/user-home.component'

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegisterComponent,
    UserHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
