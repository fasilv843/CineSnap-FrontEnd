/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, type CanActivate } from '@angular/router'
import { isTokenExpired } from '../helpers/jwt-token'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor (private readonly router: Router) {}

  canActivate (route: ActivatedRouteSnapshot): boolean {
    const role = route.parent?.routeConfig?.path
    const token = localStorage.getItem(`${role}RefreshToken`)

    if (token === null || isTokenExpired(token)) {
      return true
    } else {
      void this.router.navigate([`/${role}/home`])
      return false
    }
  }
}
