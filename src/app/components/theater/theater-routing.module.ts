/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router'
import { ThrHomeComponent } from './thr-home/thr-home.component';
import { ThrLoginComponent } from './thr-login/thr-login.component';
import { ThrRegisterComponent } from './thr-register/thr-register.component';
import { ThrShowsComponent } from './thr-shows/thr-shows.component';
import { ThrScreensComponent } from './thr-screens/thr-screens.component';
import { ThrMessagesComponent } from './thr-messages/thr-messages.component';
import { ThrProfileComponent } from './thr-profile/thr-profile.component';
import { ThrMoviesComponent } from './thr-movies/thr-movies.component';

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
    path: 'shows',
    title: 'CineSnap | Theater Shows',
    component: ThrShowsComponent
  },
  {
    path: 'screens',
    title: 'CineSnap | Theater Screens',
    component: ThrScreensComponent
  },
  {
    path: 'messages',
    title: 'CineSnap | Theater Messages',
    component: ThrMessagesComponent
  },
  {
    path: 'movies',
    title: 'CineSnap | Theater Movies',
    component: ThrMoviesComponent
  },
  {
    path: 'profile',
    title: 'CineSnap | Theater Profile',
    component: ThrProfileComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheaterRoutingModule { }
