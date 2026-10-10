import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import Swal from 'sweetalert2'
import { isTokenExpired } from '../helpers/jwt-token'

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router)
  // Top-level segment ('user' | 'theater' | 'admin'), independent of nesting depth
  const role = route.pathFromRoot[1]?.routeConfig?.path
  const token = localStorage.getItem(`${role}RefreshToken`)

  if (token === null || isTokenExpired(token)) {
    if (role !== 'user') {
      void router.navigate([`/${role}/login`])
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
        void router.navigate(['/user/login'])
      }
    })
    return false
  }
  return true
}
