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
import { LoginGuard } from 'src/app/guards/login.guard';
import { AddScreenComponent } from './add-screen/add-screen.component';
import { EditScreenComponent } from './edit-screen/edit-screen.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Dashboard',
    component: ThrHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    title: 'CineSnap | Theater Login',
    component: ThrLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    title: 'CineSnap | Theater Register',
    component: ThrRegisterComponent,
    canActivate: [LoginGuard]

  },
  {
    path: 'shows',
    title: 'CineSnap | Theater Shows',
    component: ThrShowsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'screens',
    title: 'CineSnap | Theater Screens',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ThrScreensComponent
      },
      {
        path: 'add',
        component: AddScreenComponent
      },
      {
        path: 'edit/:screenId',
        component: EditScreenComponent
      }
    ]
  },
  {
    path: 'messages',
    title: 'CineSnap | Theater Messages',
    component: ThrMessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'movies',
    title: 'CineSnap | Theater Movies',
    component: ThrMoviesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    title: 'CineSnap | Theater Profile',
    component: ThrProfileComponent,
    canActivate: [AuthGuard]
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
