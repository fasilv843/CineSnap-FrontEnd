/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserMoviesComponent } from './user-movies/user-movies.component';
import { UserTheatersComponent } from './user-theaters/user-theaters.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserLoginGuard } from 'src/app/guards/user/user-login.guard';
import { UserAuthGuard } from 'src/app/guards/user/user-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Home',
    component: UserHomeComponent
  },
  {
    path: 'login',
    title: 'CineSnap | Login',
    component: UserLoginComponent,
    canActivate: [UserLoginGuard]
  },
  {
    path: 'register',
    title: 'CineSnap | Register',
    component: UserRegisterComponent,
    canActivate: [UserLoginGuard]
  },
  {
    path: 'movies',
    title: 'CineSnap | Movies',
    component: UserMoviesComponent
  },
  {
    path: 'theaters',
    title: 'CineSnap | Theaters',
    component: UserTheatersComponent
  },
  {
    path: 'profile',
    title: 'CineSnap | Profile',
    component: UserProfileComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
