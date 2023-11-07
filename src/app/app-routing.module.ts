/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
