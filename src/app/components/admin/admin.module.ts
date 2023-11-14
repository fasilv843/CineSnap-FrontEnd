/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminTheatersComponent } from './admin-theaters/admin-theaters.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';
import { AdminMoviesComponent } from './admin-movies/admin-movies.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminLoginComponent,
    AdminNavComponent,
    AdminTheatersComponent,
    AdminUsersComponent,
    AdminMessagesComponent,
    AdminMoviesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
