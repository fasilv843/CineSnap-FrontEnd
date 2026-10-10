import { type Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'user', title: 'User', loadChildren: async () => await import('./components/user/user.routes').then(m => m.USER_ROUTES) },
  { path: 'admin', title: 'Admin', loadChildren: async () => await import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
  { path: 'theater', title: 'Theater', loadChildren: async () => await import('./components/theater/theater.routes').then(m => m.THEATER_ROUTES) },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: async () => await import('./components/common/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  }
]
