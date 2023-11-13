/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router'
import { ThrHomeComponent } from './thr-home/thr-home.component';
import { ThrLoginComponent } from './thr-login/thr-login.component';
import { ThrRegisterComponent } from './thr-register/thr-register.component';

const routes: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Dashboard',
    component: ThrHomeComponent
  },
  {
    path: 'login',
    title: 'CineSnap | Theater Login',
    component: ThrLoginComponent
  },
  {
    path: 'register',
    title: 'CineSnap | Theater Register',
    component: ThrRegisterComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    redirectTo: 'home',
    pathMatch: 'full'
  }
  // {
  //   path: 'theater',
  //   children: [
  //     {
  //       path: 'home',
  //       component: ThrHomeComponent
  //     },

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheaterRoutingModule { }
