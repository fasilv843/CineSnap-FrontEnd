import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { isTokenExpired } from '../helpers/jwt-token'

export const loginGuard: CanActivateFn = (route) => {
  const router = inject(Router)
  // Top-level segment ('user' | 'theater' | 'admin'), independent of nesting depth
  const role = route.pathFromRoot[1]?.routeConfig?.path
  const token = localStorage.getItem(`${role}RefreshToken`)

  if (token === null || isTokenExpired(token)) {
    return true
  }
  void router.navigate([`/${role}/home`])
  return false
}
