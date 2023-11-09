import { RouterModule, type Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { AdminHomeComponent } from './admin-home/admin-home.component'
import { AdminLoginComponent } from './admin-login/admin-login.component'

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {}
