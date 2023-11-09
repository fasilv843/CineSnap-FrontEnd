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
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AdminRegisterComponent } from './components/admin/admin-register/admin-register.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component'
import { AdminRoutingModule } from './components/admin/admin.routing'

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegisterComponent,
    UserHomeComponent,
    AdminRegisterComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    AdminNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserRoutingModule,
    AdminRoutingModule,
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
