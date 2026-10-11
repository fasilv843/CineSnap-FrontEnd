import { type Routes } from '@angular/router'
import { authGuard } from 'src/app/core/auth/auth.guard'
import { loginGuard } from 'src/app/core/auth/login.guard'

export const THEATER_ROUTES: Routes = [
  {
    path: 'login',
    title: 'CineSnap | Theater Login',
    loadComponent: async () => await import('./pages/login/login.component').then(m => m.TheaterLoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    title: 'CineSnap | Theater Register',
    loadComponent: async () => await import('./pages/register/register.component').then(m => m.TheaterRegisterComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'approval',
    title: 'CineSnap | Theater Approval',
    children: [
      {
        path: 'pending',
        loadComponent: async () => await import('./pages/approval-pending/approval-pending.component').then(m => m.TheaterApprovalPendingComponent)
      },
      {
        path: 'rejected',
        loadComponent: async () => await import('./pages/approval-rejected/approval-rejected.component').then(m => m.TheaterApprovalRejectedComponent)
      }
    ]
  },
  {
    // Signed-in theater area: the shell holds the navigation, pages render inside it
    path: '',
    loadComponent: async () => await import('./layout/theater-shell/theater-shell.component').then(m => m.TheaterShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'CineSnap | Dashboard',
        loadComponent: async () => await import('./pages/dashboard/dashboard.component').then(m => m.TheaterDashboardComponent)
      },
      {
        path: 'shows',
        title: 'CineSnap | Theater Shows',
        loadComponent: async () => await import('./pages/shows/shows.component').then(m => m.TheaterShowsComponent)
      },
      {
        path: 'screens',
        title: 'CineSnap | Theater Screens',
        children: [
          {
            path: '',
            loadComponent: async () => await import('./pages/screens/screens.component').then(m => m.TheaterScreensComponent)
          },
          {
            path: 'seat/:seatId',
            title: 'CineSnap | Seat Layout',
            loadComponent: async () => await import('./pages/seating/seating.component').then(m => m.TheaterSeatingComponent)
          }
        ]
      },
      {
        path: 'messages',
        title: 'CineSnap | Theater Messages',
        loadComponent: async () => await import('./pages/messages/messages.component').then(m => m.TheaterMessagesComponent)
      },
      {
        path: 'messages/:id',
        title: 'CineSnap | Theater Messages',
        loadComponent: async () => await import('./pages/messages/messages.component').then(m => m.TheaterMessagesComponent)
      },
      {
        path: 'movies',
        title: 'CineSnap | Theater Movies',
        loadComponent: async () => await import('./pages/movies/movies.component').then(m => m.TheaterMoviesComponent)
      },
      {
        path: 'profile',
        title: 'CineSnap | Theater Profile',
        children: [
          {
            path: '',
            loadComponent: async () => await import('./pages/profile/profile.component').then(m => m.TheaterProfileComponent)
          },
          {
            path: 'edit/:theaterId',
            title: 'CineSnap | Edit Profile',
            loadComponent: async () => await import('./pages/edit-profile/edit-profile.component').then(m => m.TheaterEditProfileComponent)
          },
          {
            path: 'wallet-history',
            title: 'CineSnap | Wallet History',
            loadComponent: async () => await import('./pages/wallet/wallet.component').then(m => m.TheaterWalletComponent)
          }
        ]
      },
      {
        path: 'tickets/:theaterId',
        title: 'CineSnap | Tickets',
        loadComponent: async () => await import('./pages/tickets/tickets.component').then(m => m.TheaterTicketsComponent)
      },
      {
        path: 'coupons',
        title: 'CineSnap | Coupons',
        loadComponent: async () => await import('./pages/coupons/coupons.component').then(m => m.TheaterCouponsComponent)
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
    ]
  }
]
