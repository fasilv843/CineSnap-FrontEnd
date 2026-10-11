import { type Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'user', title: 'User', loadChildren: async () => await import('./user/user.routes').then(m => m.USER_ROUTES) },
  { path: 'admin', title: 'Admin', loadChildren: async () => await import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) },
  { path: 'theater', title: 'Theater', loadChildren: async () => await import('./theater/theater.routes').then(m => m.THEATER_ROUTES) },
  {
    path: '',
    pathMatch: 'full',
    title: 'CineSnap | Book movie tickets',
    loadComponent: async () => await import('./public/pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: async () => await import('./public/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
]
