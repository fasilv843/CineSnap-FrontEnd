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
import { LoginGuard } from 'src/app/guards/login.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Dashboard',
    component: AdminHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    title: 'CineSnap | Admin Login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'theaters',
    title: 'CineSnap | Theaters',
    component: AdminTheatersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    title: 'CineSnap | Users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    title: 'CineSnap | Messages',
    component: AdminMessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'movies',
    title: 'CineSnap | Movies',
    canActivate: [AuthGuard],
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
