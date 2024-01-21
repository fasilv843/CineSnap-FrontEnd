/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/semi */
import { Inject, Injectable } from '@angular/core'
import {
  type HttpRequest,
  type HttpHandler,
  type HttpEvent,
  type HttpInterceptor
} from '@angular/common/http'
import { type Observable } from 'rxjs'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router'
import { isTokenExpired } from '../helpers/jwt-token'
import { AuthService } from '../services/auth.service'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor (
    private readonly router: Router,
    @Inject(AuthService) private readonly authService: AuthService
  ) { }

  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If there is bypass interceptor header, don't add jwt
    if (request.headers.has('Bypass-Interceptor')) {
      console.log('bypassing interceptor from JwtInterceptor');
      return next.handle(request)
    }
    console.log('No bypass interceptor here', request.url);
    const urlArr = request.url.split('/');
    const user = urlArr[0]
    const route = urlArr[1]

    console.log('handling route : ', route);
    console.warn(urlArr, 'urlArr');

    if (route === 'login' || route === 'register') {
      return next.handle(request)
    }

    if (route === 'validateOtp' || route === 'resendOtp') {
      console.log('getting authToken, inside validateOTp or resend otp');
      const authToken = localStorage.getItem(user + 'AuthToken')
      if (authToken != null) {
        const authRequest = request.clone({
          setHeaders: { Authorization: `Bearer ${authToken}` }
        });
        return next.handle(authRequest);
      }
      console.log('authToken not available');
      return next.handle(request);
    }

    // getting access token
    const accessToken = localStorage.getItem(user + 'AccessToken');
    console.warn(accessToken, 'access token');

    // If access token is available
    if (accessToken !== null && !isTokenExpired(accessToken)) {
      const accessRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('handling accessed request');
      return next.handle(accessRequest)
    }

    // If access token is not available, checking refresh token
    console.log('removing access token');
    localStorage.removeItem(user + 'AccessToken')
    const refreshToken = localStorage.getItem(user + 'RefreshToken')
    console.warn(refreshToken, 'refresh token');

    // If refresh token is available
    if (refreshToken !== null && !isTokenExpired(refreshToken)) {
      console.log('accessToken is not available, generating new token');
      this.authService.getAccessToken(refreshToken).subscribe({
        next: (res) => {
          const newAccessToken = res.accessToken
          console.log(newAccessToken, 'new access token from backend');

          localStorage.setItem(user + 'AccessToken', newAccessToken)
          const newAccessRequest = request.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` }
          });
          console.log('handling request with new access token');

          return next.handle(newAccessRequest)
        }
      })

      // .pipe(
      //   switchMap((res) => {
      //     const newAccessToken = res.accessToken
      //     console.log(newAccessToken, 'new access token from backend');

      //     localStorage.setItem(user + 'AccessToken', newAccessToken)
      //     const newAccessRequest = request.clone({
      //       setHeaders: { Authorization: `Bearer ${newAccessToken}` }
      //     });
      //     console.log('handling request with new access token')

      //     return next.handle(newAccessRequest)
      //   })

      // )

    }

    // If refresh token is not available, redirect to login page
    // console.warn('removing refresh token, !!!');
    // localStorage.removeItem(user + 'RefreshToken')
    console.log(request.headers, 'req.headers');
    // if (user !== 'user')
    console.log('handling request without jwt token');
    return next.handle(request);
  }
}
