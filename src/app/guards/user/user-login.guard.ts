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

    if (token !== null) {
      console.log('user already logged in')
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log(payload, 'payload')
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (payload?.exp) {
        const expireDate = payload.exp * 1000
        console.log(expireDate, Date.now())
        if (expireDate > Date.now()) {
          return false
        }
        console.log('token expired')
      } else {
        console.warn('token not have expiration date')
        return false
      }
    }
    return true
  }
}
