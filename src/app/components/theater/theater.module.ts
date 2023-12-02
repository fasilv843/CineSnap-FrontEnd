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
import { ValidationModule } from 'src/app/modules/validation/validation.module';
import { StoreModule } from '@ngrx/store';
import { theaterReducer } from 'src/app/states/theater/theater.reducer';
import { AddScreenComponent } from './add-screen/add-screen.component';
import { EditScreenComponent } from './edit-screen/edit-screen.component';
import { EditTheaterProfileComponent } from './edit-theater-profile/edit-theater-profile.component';
import { ImageModule } from 'src/app/modules/image/image.module';
import { ThrSeatingComponent } from './thr-seating/thr-seating.component';

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
    ThrProfileComponent,
    AddScreenComponent,
    EditScreenComponent,
    EditTheaterProfileComponent,
    ThrSeatingComponent
  ],
  imports: [
    CommonModule,
    TheaterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    StoreModule.forFeature('theater', theaterReducer),
    ImageModule
  ]
})
export class TheaterModule { }
