/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheaterRoutingModule } from './theater-routing.module';
import { ThrNavComponent } from './thr-nav/thr-nav.component';
import { ThrLoginComponent } from './thr-login/thr-login.component';
import { ThrRegisterComponent } from './thr-register/thr-register.component';
import { ThrHomeComponent } from './thr-home/thr-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThrShowsComponent } from './thr-shows/thr-shows.component';
import { ThrScreensComponent } from './thr-screens/thr-screens.component';
import { ThrMessagesComponent } from './thr-messages/thr-messages.component';
import { ThrMoviesComponent } from './thr-movies/thr-movies.component';
import { ThrProfileComponent } from './thr-profile/thr-profile.component';

@NgModule({
  declarations: [
    ThrLoginComponent,
    ThrRegisterComponent,
    ThrHomeComponent,
    ThrNavComponent,
    ThrShowsComponent,
    ThrScreensComponent,
    ThrMessagesComponent,
    ThrMoviesComponent,
    ThrProfileComponent
  ],
  imports: [
    CommonModule,
    TheaterRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TheaterModule { }