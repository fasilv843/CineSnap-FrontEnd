import { type Routes } from '@angular/router'
import { authGuard } from 'src/app/core/auth/auth.guard'
import { loginGuard } from 'src/app/core/auth/login.guard'

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    title: 'CineSnap | Admin Login',
    loadComponent: async () => await import('./pages/login/login.component').then(m => m.AdminLoginComponent),
    canActivate: [loginGuard]
  },
  {
    // Signed-in admin area: the shell holds the navigation, pages render inside it
    path: '',
    loadComponent: async () => await import('./layout/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'CineSnap | Dashboard',
        loadComponent: async () => await import('./pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'theaters',
        title: 'CineSnap | Theaters',
        loadComponent: async () => await import('./pages/theaters/theaters.component').then(m => m.AdminTheatersComponent)
      },
      {
        path: 'users',
        title: 'CineSnap | Users',
        loadComponent: async () => await import('./pages/users/users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'messages',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./pages/messages/messages.component').then(m => m.AdminMessagesComponent)
      },
      {
        path: 'movies',
        title: 'CineSnap | Movies',
        children: [
          {
            path: 'cinesnap',
            title: 'CineSnap | CineSnap Movies',
            loadComponent: async () => await import('./pages/movies/movies.component').then(m => m.AdminMoviesComponent)
          },
          {
            path: 'tmdb',
            title: 'CineSnap | TMDB Movies',
            loadComponent: async () => await import('./pages/tmdb-movies/tmdb-movies.component').then(m => m.AdminTmdbMoviesComponent)
          },
          {
            path: ':lang',
            title: 'CineSnap | Browse Movies',
            loadComponent: async () => await import('./pages/tmdb-explore/tmdb-explore.component').then(m => m.AdminTmdbExploreComponent)
          },
          {
            path: '',
            redirectTo: 'tmdb',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'tickets',
        title: 'CineSnap | Tickets',
        loadComponent: async () => await import('./pages/tickets/tickets.component').then(m => m.AdminTicketsComponent)
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
