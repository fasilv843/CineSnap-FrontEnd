import { type Routes } from '@angular/router'
import { authGuard } from 'src/app/guards/auth.guard'
import { loginGuard } from 'src/app/guards/login.guard'

export const ADMIN_ROUTES: Routes = [
  {
    path: 'home',
    title: 'CineSnap | Dashboard',
    loadComponent: async () => await import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    title: 'CineSnap | Admin Login',
    loadComponent: async () => await import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'theaters',
    title: 'CineSnap | Theaters',
    loadComponent: async () => await import('./admin-theaters/admin-theaters.component').then(m => m.AdminTheatersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    title: 'CineSnap | Users',
    loadComponent: async () => await import('./admin-users/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messages',
    title: 'CineSnap | Messages',
    loadComponent: async () => await import('./admin-messages/admin-messages.component').then(m => m.AdminMessagesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'movies',
    title: 'CineSnap | Movies',
    canActivate: [authGuard],
    children: [
      {
        path: 'cinesnap',
        loadComponent: async () => await import('./admin-cs-movies/admin-cs-movies.component').then(m => m.AdminCsMoviesComponent)
      },
      {
        path: 'tmdb',
        loadComponent: async () => await import('./admin-movies/admin-movies.component').then(m => m.AdminMoviesComponent)
      },
      {
        path: ':lang',
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
    loadComponent: async () => await import('./admin-tickets/admin-tickets.component').then(m => m.AdminTicketsComponent),
    canActivate: [authGuard]
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
