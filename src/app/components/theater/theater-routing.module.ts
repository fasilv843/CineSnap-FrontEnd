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
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EditTheaterProfileComponent } from './edit-theater-profile/edit-theater-profile.component';
import { ThrSeatingComponent } from './thr-seating/thr-seating.component';
import { ApprovalPendingComponent } from './approval-pending/approval-pending.component';
import { ApprovalRejectedComponent } from './approval-rejected/approval-rejected.component';
import { ThrTicketsComponent } from './thr-tickets/thr-tickets.component';
import { ThrWalletComponent } from './thr-wallet/thr-wallet.component';

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
    path: 'approval',
    title: 'CineSnap | Theater Approval',
    children: [
      {
        path: 'pending',
        component: ApprovalPendingComponent
      },
      {
        path: 'rejected',
        component: ApprovalRejectedComponent
      }
    ]
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
        path: 'seat/:seatId',
        component: ThrSeatingComponent
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
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ThrProfileComponent
      },
      {
        path: 'edit/:theaterId',
        component: EditTheaterProfileComponent
      },
      {
        path: 'wallet-history',
        component: ThrWalletComponent
      }
    ]
  },
  {
    path: 'tickets/:theaterId',
    title: 'CineSnap | Tickets',
    component: ThrTicketsComponent
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
