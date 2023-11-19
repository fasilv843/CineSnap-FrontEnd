/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminMoviesComponent } from './admin-movies/admin-movies.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';
import { AdminTheatersComponent } from './admin-theaters/admin-theaters.component';
import { AdminCsMoviesComponent } from './admin-cs-movies/admin-cs-movies.component';
import { AdminMoviesExploreComponent } from './admin-movies-explore/admin-movies-explore.component';

const routes: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Dashboard',
    component: AdminHomeComponent
  },
  {
    path: 'login',
    title: 'CineSnap | Admin Login',
    component: AdminLoginComponent
  },
  {
    path: 'theaters',
    title: 'CineSnap | Theaters',
    component: AdminTheatersComponent
  },
  {
    path: 'users',
    title: 'CineSnap | Users',
    component: AdminUsersComponent
  },
  {
    path: 'messages',
    title: 'CineSnap | Messages',
    component: AdminMessagesComponent
  },
  {
    path: 'movies',
    title: 'CineSnap | Movies',
    children: [
      {
        path: 'cinesnap',
        component: AdminCsMoviesComponent
      },
      {
        path: 'tmdb',
        component: AdminMoviesComponent
      },
      {
        path: ':lang',
        component: AdminMoviesExploreComponent
      },
      {
        path: '',
        redirectTo: 'tmdb',
        pathMatch: 'full'
      }
    ]
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
export class AdminRoutingModule { }
