import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { isTokenExpired } from './jwt-token'
import { ToastService } from '../toast/toast.service'

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router)
  // Top-level segment ('user' | 'theater' | 'admin'), independent of nesting depth
  const role = route.pathFromRoot[1]?.routeConfig?.path
  const token = localStorage.getItem(`${role}RefreshToken`)

  if (token === null || isTokenExpired(token)) {
    if (role === 'user') inject(ToastService).info('Log in to continue', 'That page needs your CineSnap account.')
    return router.createUrlTree([`/${role}/login`])
  }
  return true
}
