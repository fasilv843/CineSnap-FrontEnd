import { RouterModule, type Routes } from '@angular/router'
import { UserLoginComponent } from './user-login/user-login.component'
import { UserRegisterComponent } from './user-register/user-register.component'
import { NgModule } from '@angular/core'
import { UserHomeComponent } from './user-home/user-home.component'

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'home',
        component: UserHomeComponent
      },
      {
        path: 'login',
        component: UserLoginComponent
      },
      {
        path: 'register',
        component: UserRegisterComponent
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

export class UserRoutingModule {}
