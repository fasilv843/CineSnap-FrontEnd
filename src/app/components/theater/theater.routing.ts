import { RouterModule, type Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { ThrHomeComponent } from './thr-home/thr-home.component'
import { ThrLoginComponent } from './thr-login/thr-login.component'
import { ThrRegisterComponent } from './thr-register/thr-register.component'

const routes: Routes = [
  {
    path: 'theater',
    children: [
      {
        path: 'home',
        component: ThrHomeComponent
      },
      {
        path: 'login',
        component: ThrLoginComponent
      },
      {
        path: 'register',
        component: ThrRegisterComponent
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

export class TheaterRoutingModule {}
