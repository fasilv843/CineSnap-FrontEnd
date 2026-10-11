import { type Routes } from '@angular/router'
import { authGuard } from 'src/app/guards/auth.guard'
import { loginGuard } from 'src/app/guards/login.guard'

export const THEATER_ROUTES: Routes = [
  {
    path: 'login',
    title: 'CineSnap | Theater Login',
    loadComponent: async () => await import('./thr-login/thr-login.component').then(m => m.ThrLoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    title: 'CineSnap | Theater Register',
    loadComponent: async () => await import('./thr-register/thr-register.component').then(m => m.ThrRegisterComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'approval',
    title: 'CineSnap | Theater Approval',
    children: [
      {
        path: 'pending',
        loadComponent: async () => await import('./approval-pending/approval-pending.component').then(m => m.ApprovalPendingComponent)
      },
      {
        path: 'rejected',
        loadComponent: async () => await import('./approval-rejected/approval-rejected.component').then(m => m.ApprovalRejectedComponent)
      }
    ]
  },
  {
    // Signed-in theater area: the shell holds the navigation, pages render inside it
    path: '',
    loadComponent: async () => await import('./thr-shell/thr-shell.component').then(m => m.ThrShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'CineSnap | Dashboard',
        loadComponent: async () => await import('./thr-home/thr-home.component').then(m => m.ThrHomeComponent)
      },
      {
        path: 'shows',
        title: 'CineSnap | Theater Shows',
        loadComponent: async () => await import('./thr-shows/thr-shows.component').then(m => m.ThrShowsComponent)
      },
      {
        path: 'screens',
        title: 'CineSnap | Theater Screens',
        children: [
          {
            path: '',
            loadComponent: async () => await import('./thr-screens/thr-screens.component').then(m => m.ThrScreensComponent)
          },
          {
            path: 'seat/:seatId',
            title: 'CineSnap | Seat Layout',
            loadComponent: async () => await import('./thr-seating/thr-seating.component').then(m => m.ThrSeatingComponent)
          }
        ]
      },
      {
        path: 'messages',
        title: 'CineSnap | Theater Messages',
        loadComponent: async () => await import('./thr-messages/thr-messages.component').then(m => m.ThrMessagesComponent)
      },
      {
        path: 'messages/:id',
        title: 'CineSnap | Theater Messages',
        loadComponent: async () => await import('./thr-messages/thr-messages.component').then(m => m.ThrMessagesComponent)
      },
      {
        path: 'movies',
        title: 'CineSnap | Theater Movies',
        loadComponent: async () => await import('./thr-movies/thr-movies.component').then(m => m.ThrMoviesComponent)
      },
      {
        path: 'profile',
        title: 'CineSnap | Theater Profile',
        children: [
          {
            path: '',
            loadComponent: async () => await import('./thr-profile/thr-profile.component').then(m => m.ThrProfileComponent)
          },
          {
            path: 'edit/:theaterId',
            title: 'CineSnap | Edit Profile',
            loadComponent: async () => await import('./edit-theater-profile/edit-theater-profile.component').then(m => m.EditTheaterProfileComponent)
          },
          {
            path: 'wallet-history',
            title: 'CineSnap | Wallet History',
            loadComponent: async () => await import('./thr-wallet/thr-wallet.component').then(m => m.ThrWalletComponent)
          }
        ]
      },
      {
        path: 'tickets/:theaterId',
        title: 'CineSnap | Tickets',
        loadComponent: async () => await import('./thr-tickets/thr-tickets.component').then(m => m.ThrTicketsComponent)
      },
      {
        path: 'coupons',
        title: 'CineSnap | Coupons',
        loadComponent: async () => await import('./thr-coupon/thr-coupon.component').then(m => m.ThrCouponComponent)
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
