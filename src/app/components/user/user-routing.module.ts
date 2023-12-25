/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserMoviesComponent } from './user-movies/user-movies.component';
import { UserTheatersComponent } from './user-theaters/user-theaters.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginGuard } from 'src/app/guards/login.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { TheaterPageComponent } from './theater-page/theater-page.component';
import { UserMessageComponent } from './user-message/user-message.component';
import { ShowSeatsComponent } from './show-seats/show-seats.component';
import { BookingComponent } from './booking/booking.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';

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
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    title: 'CineSnap | Register',
    component: UserRegisterComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'movies',
    title: 'CineSnap | Movies',
    component: UserMoviesComponent,
    children: [
      {
        path: ':filter',
        component: UserMoviesComponent
      }
    ]
  },
  {
    path: 'theaters',
    title: 'CineSnap | Theaters',
    component: UserTheatersComponent
  },
  {
    path: 'theater',
    title: 'CineSnap | Theater',
    children: [
      {
        path: ':theaterId',
        component: TheaterPageComponent
      }
      // {
      //   path: 'shows/:theaterId/:showId',
      //   component: ShowSeatsComponent
      // }
    ]
  },
  {
    path: 'show',
    title: 'CineSnap | Show',
    children: [
      {
        path: 'seats/:theaterId/:showId',
        component: ShowSeatsComponent
      },
      {
        path: 'book',
        children: [
          {
            path: ':ticketId',
            component: BookingComponent
          },
          {
            path: 'success/:ticketId',
            component: BookingSuccessComponent
          }
        ]
      }
    ]
  },
  {
    path: 'profile',
    title: 'CineSnap | Profile',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserProfileComponent
      },
      {
        path: 'edit/:userId',
        component: EditUserProfileComponent
      }
    ]
  },
  {
    path: 'bookings/:userId',
    component: UserBookingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: UserMessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages/:id',
    component: UserMessageComponent,
    canActivate: [AuthGuard]
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
