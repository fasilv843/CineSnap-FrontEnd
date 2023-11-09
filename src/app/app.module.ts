/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { UserLoginComponent } from './components/user/user-login/user-login.component'
import { UserRegisterComponent } from './components/user/user-register/user-register.component'
import { UserRoutingModule } from './components/user/user.routing';
import { UserHomeComponent } from './components/user/user-home/user-home.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { TransformUrlInterceptor } from './interceptors/transform-url.interceptor'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { JwtInterceptor } from './interceptors/jwt.interceptor'

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
    UserRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TransformUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
