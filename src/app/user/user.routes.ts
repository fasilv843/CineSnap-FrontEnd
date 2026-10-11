import { type Routes } from '@angular/router'
import { GoogleLoginProvider, SOCIAL_AUTH_CONFIG, SocialAuthService, type SocialAuthServiceConfig } from '@abacritt/angularx-social-login'
import { authGuard } from 'src/app/core/auth/auth.guard'
import { loginGuard } from 'src/app/core/auth/login.guard'
import { environments } from 'src/environments/environment'

export const USER_ROUTES: Routes = [
  {
    // Scopes Google sign-in to the user area so the library stays out of the initial bundle
    path: '',
    providers: [
      SocialAuthService,
      {
        provide: SOCIAL_AUTH_CONFIG,
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(environments.google_client_id)
            }
          ]
        } satisfies SocialAuthServiceConfig
      }
    ],
    children: [
      {
        path: 'home',
        title: 'CineSnap | Home',
        loadComponent: async () => await import('./pages/home/home.component').then(m => m.UserHomeComponent)
      },
      {
        path: 'login',
        title: 'CineSnap | Login',
        loadComponent: async () => await import('./pages/login/login.component').then(m => m.UserLoginComponent),
        canActivate: [loginGuard]
      },
      {
        path: 'register',
        title: 'CineSnap | Register',
        loadComponent: async () => await import('./pages/register/register.component').then(m => m.UserRegisterComponent),
        canActivate: [loginGuard]
      },
      {
        path: 'movies',
        title: 'CineSnap | Movies',
        loadComponent: async () => await import('./pages/movies/movies.component').then(m => m.UserMoviesComponent)
      },
      {
        path: 'theaters',
        title: 'CineSnap | Theaters',
        loadComponent: async () => await import('./pages/theaters/theaters.component').then(m => m.UserTheatersComponent)
      },
      {
        path: 'theater',
        title: 'CineSnap | Theater',
        children: [
          {
            path: ':theaterId',
            loadComponent: async () => await import('./pages/theater-detail/theater-detail.component').then(m => m.UserTheaterDetailComponent)
          }
        ]
      },
      {
        path: 'show',
        title: 'CineSnap | Show',
        children: [
          {
            path: 'seats/:seatId',
            loadComponent: async () => await import('./pages/show-seats/show-seats.component').then(m => m.UserShowSeatsComponent)
          },
          {
            path: 'book',
            children: [
              {
                path: ':ticketId',
                loadComponent: async () => await import('./pages/checkout/checkout.component').then(m => m.UserCheckoutComponent)
              },
              {
                path: 'success/:ticketId',
                loadComponent: async () => await import('./pages/booking-success/booking-success.component').then(m => m.UserBookingSuccessComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'profile',
        title: 'CineSnap | Profile',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: async () => await import('./pages/profile/profile.component').then(m => m.UserProfileComponent)
          },
          {
            path: 'edit/:userId',
            loadComponent: async () => await import('./pages/edit-profile/edit-profile.component').then(m => m.UserEditProfileComponent)
          },
          {
            path: 'wallet-history',
            loadComponent: async () => await import('./pages/wallet/wallet.component').then(m => m.UserWalletComponent)
          }
        ]
      },
      {
        path: 'bookings/:userId',
        title: 'CineSnap | Bookings',
        loadComponent: async () => await import('./pages/bookings/bookings.component').then(m => m.UserBookingsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'messages',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./pages/messages/messages.component').then(m => m.UserMessagesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'messages/:id',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./pages/messages/messages.component').then(m => m.UserMessagesComponent),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
]
