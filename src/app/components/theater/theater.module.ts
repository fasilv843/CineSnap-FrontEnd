/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheaterRoutingModule } from './theater-routing.module';
import { ThrNavComponent } from './thr-nav/thr-nav.component';
import { ThrLoginComponent } from './thr-login/thr-login.component';
import { ThrRegisterComponent } from './thr-register/thr-register.component';
import { ThrHomeComponent } from './thr-home/thr-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ThrLoginComponent,
    ThrRegisterComponent,
    ThrHomeComponent,
    ThrNavComponent
  ],
  imports: [
    CommonModule,
    TheaterRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TheaterModule { }
