/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import { type CanActivate } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UserLoginGuard implements CanActivate {
  canActivate (): boolean {
    console.log('user login guard working')

    const token = localStorage.getItem('userToken')

    if (token != null) {
      console.log('user already logged in')
      return false
    }

    return true
  }
}
