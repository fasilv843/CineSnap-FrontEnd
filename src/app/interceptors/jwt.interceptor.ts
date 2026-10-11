import { inject } from '@angular/core'
import { type HttpInterceptorFn } from '@angular/common/http'
import { switchMap } from 'rxjs'
import { isTokenExpired } from '../helpers/jwt-token'
import { AuthService } from '../services/auth.service'

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService)

  // Third-party APIs (TMDB, Geoapify) and the token refresh itself carry no CineSnap token
  if (request.headers.has('Bypass-Interceptor')) return next(request)

  // URLs are relative here, e.g. "theater/shows/…": the first segment is the role
  const [role, route] = request.url.split('/')

  if (route === 'login' || route === 'register') return next(request)

  // Sign-up code steps use the short-lived token issued at registration
  if (route === 'validateOtp' || route === 'resendOtp') {
    const authToken = localStorage.getItem(role + 'AuthToken')
    return next(authToken !== null ? request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } }) : request)
  }

  const accessToken = localStorage.getItem(role + 'AccessToken')
  if (accessToken !== null && !isTokenExpired(accessToken)) {
    return next(request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }))
  }

  // Access token missing or expired: get a new one with the refresh token, then send the request with it
  localStorage.removeItem(role + 'AccessToken')
  const refreshToken = localStorage.getItem(role + 'RefreshToken')
  if (refreshToken !== null && !isTokenExpired(refreshToken)) {
    return authService.getAccessToken(refreshToken).pipe(
      switchMap(res => {
        localStorage.setItem(role + 'AccessToken', res.accessToken)
        return next(request.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }))
      })
    )
  }

  return next(request)
}
