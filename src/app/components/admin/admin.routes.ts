import { type Routes } from '@angular/router'
import { authGuard } from 'src/app/guards/auth.guard'
import { loginGuard } from 'src/app/guards/login.guard'

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    title: 'CineSnap | Admin Login',
    loadComponent: async () => await import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [loginGuard]
  },
  {
    // Signed-in admin area: the shell holds the navigation, pages render inside it
    path: '',
    loadComponent: async () => await import('./admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'CineSnap | Dashboard',
        loadComponent: async () => await import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent)
      },
      {
        path: 'theaters',
        title: 'CineSnap | Theaters',
        loadComponent: async () => await import('./admin-theaters/admin-theaters.component').then(m => m.AdminTheatersComponent)
      },
      {
        path: 'users',
        title: 'CineSnap | Users',
        loadComponent: async () => await import('./admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'messages',
        title: 'CineSnap | Messages',
        loadComponent: async () => await import('./admin-messages/admin-messages.component').then(m => m.AdminMessagesComponent)
      },
      {
        path: 'movies',
        title: 'CineSnap | Movies',
        children: [
          {
            path: 'cinesnap',
            title: 'CineSnap | CineSnap Movies',
            loadComponent: async () => await import('./admin-cs-movies/admin-cs-movies.component').then(m => m.AdminCsMoviesComponent)
          },
          {
            path: 'tmdb',
            title: 'CineSnap | TMDB Movies',
            loadComponent: async () => await import('./admin-movies/admin-movies.component').then(m => m.AdminMoviesComponent)
          },
          {
            path: ':lang',
            title: 'CineSnap | Browse Movies',
            loadComponent: async () => await import('./admin-movies-explore/admin-movies-explore.component').then(m => m.AdminMoviesExploreComponent)
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
        loadComponent: async () => await import('./admin-tickets/admin-tickets.component').then(m => m.AdminTicketsComponent)
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
