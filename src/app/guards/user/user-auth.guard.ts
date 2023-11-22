/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import { type CanActivate, Router } from '@angular/router'
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor (private readonly router: Router) {}

  canActivate (): boolean {
    console.log('user auth guard working')

    const token = localStorage.getItem('userToken')

    if (token === null) {
      console.log('user not logged in')
      void Swal.fire({
        title: 'You are not logged in',
        text: 'Do you want to redirect to login page',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          void this.router.navigate(['/user/login'])
        }
      })
      return false
    }

    return true
  }
}
