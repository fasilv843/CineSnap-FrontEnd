/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'user', title: 'User', loadChildren: () => import('./components/user/user.module').then(m => m.UserModule) },
  { path: 'admin', title: 'Admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
  { path: 'theater', title: 'Theater', loadChildren: () => import('./components/theater/theater.module').then(m => m.TheaterModule) },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
