/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import { type CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router'
import Swal from 'sweetalert2'
import { isTokenExpired } from '../helpers/jwt-token'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private readonly router: Router) {}

  canActivate (route: ActivatedRouteSnapshot): boolean {
    const role = route.parent?.routeConfig?.path
    const token = localStorage.getItem(`${role}RefreshToken`)

    if (token === null || isTokenExpired(token)) {
      if (role !== 'user') {
        void this.router.navigate([`/${role}/login`])
        return false
      }

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
