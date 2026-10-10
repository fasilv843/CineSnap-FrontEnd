import { type Routes } from '@angular/router'
import { GoogleLoginProvider, SOCIAL_AUTH_CONFIG, SocialAuthService, type SocialAuthServiceConfig } from '@abacritt/angularx-social-login'
import { authGuard } from 'src/app/guards/auth.guard'
import { loginGuard } from 'src/app/guards/login.guard'
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
        loadComponent: async () => await import('./user-home/user-home.component').then(m => m.UserHomeComponent)
      },
      {
        path: 'login',
        title: 'CineSnap | Login',
        loadComponent: async () => await import('./user-login/user-login.component').then(m => m.UserLoginComponent),
        canActivate: [loginGuard]
      },
      {
        path: 'register',
        title: 'CineSnap | Register',
        loadComponent: async () => await import('./user-register/user-register.component').then(m => m.UserRegisterComponent),
        canActivate: [loginGuard]
      },
      {
        path: 'movies',
        title: 'CineSnap | Movies',
        loadComponent: async () => await import('./user-movies/user-movies.component').then(m => m.UserMoviesComponent)
      },
      {
        path: 'theaters',
        title: 'CineSnap | Theaters',
        loadComponent: async () => await import('./user-theaters/user-theaters.component').then(m => m.UserTheatersComponent)
      },
      {
        path: 'theater',
        title: 'CineSnap | Theater',
        children: [
          {
            path: ':theaterId',
            loadComponent: async () => await import('./theater-page/theater-page.component').then(m => m.TheaterPageComponent)
          }
        ]
      },
      {
        path: 'show',
        title: 'CineSnap | Show',
        children: [
          {
            path: 'seats/:seatId',
            loadComponent: async () => await import('./show-seats/show-seats.component').then(m => m.ShowSeatsComponent)
          },
          {
            path: 'book',
            children: [
              {
                path: ':ticketId',
                loadComponent: async () => await import('./booking/booking.component').then(m => m.BookingComponent)
              },
              {
                path: 'success/:ticketId',
                loadComponent: async () => await import('./booking-success/booking-success.component').then(m => m.BookingSuccessComponent)
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
            loadComponent: async () => await import('./user-profile/user-profile.component').then(m => m.UserProfileComponent)
          },
          {
            path: 'edit/:userId',
            loadComponent: async () => await import('./edit-user-profile/edit-user-profile.component').then(m => m.EditUserProfileComponent)
          },
          {
            path: 'wallet-history',
            loadComponent: async () => await import('./user-wallet/user-wallet.component').then(m => m.UserWalletComponent)
          }
        ]
      },
      {
        path: 'bookings/:userId',
        title: 'CineSnap | Bookings',
        loadComponent: async () => await import('./user-bookings/user-bookings.component').then(m => m.UserBookingsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'messages',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./user-message/user-message.component').then(m => m.UserMessageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'messages/:id',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./user-message/user-message.component').then(m => m.UserMessageComponent),
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
