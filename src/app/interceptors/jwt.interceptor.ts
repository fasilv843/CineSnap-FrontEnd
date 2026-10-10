/* eslint-disable @typescript-eslint/semi */
import { inject } from '@angular/core'
import { type HttpInterceptorFn } from '@angular/common/http'
import { isTokenExpired } from '../helpers/jwt-token'
import { AuthService } from '../services/auth.service'

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService)

  // If there is bypass interceptor header, don't add jwt
  if (request.headers.has('Bypass-Interceptor')) {
    console.log('bypassing interceptor from JwtInterceptor');
    return next(request)
  }
  console.log('No bypass interceptor here', request.url);
  const urlArr = request.url.split('/');
  const user = urlArr[0]
  const route = urlArr[1]

  console.log('handling route : ', route);
  console.warn(urlArr, 'urlArr');

  if (route === 'login' || route === 'register') {
    return next(request)
  }

  if (route === 'validateOtp' || route === 'resendOtp') {
    console.log('getting authToken, inside validateOTp or resend otp');
    const authToken = localStorage.getItem(user + 'AuthToken')
    if (authToken != null) {
      const authRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
      return next(authRequest);
    }
    console.log('authToken not available');
    return next(request);
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
    return next(accessRequest)
  }

  // If access token is not available, checking refresh token
  console.log('removing access token');
  localStorage.removeItem(user + 'AccessToken')
  const refreshToken = localStorage.getItem(user + 'RefreshToken')
  console.warn(refreshToken, 'refresh token');

  // If refresh token is available
  // TODO: pre-existing bug — the refreshed request below is never returned; the original request goes out without a token
  if (refreshToken !== null && !isTokenExpired(refreshToken)) {
    console.log('accessToken is not available, generating new token');
    authService.getAccessToken(refreshToken).subscribe({
      next: (res) => {
        const newAccessToken = res.accessToken
        console.log(newAccessToken, 'new access token from backend');

        localStorage.setItem(user + 'AccessToken', newAccessToken)
        const newAccessRequest = request.clone({
          setHeaders: { Authorization: `Bearer ${newAccessToken}` }
        });
        console.log('handling request with new access token');

        return next(newAccessRequest)
      }
    })
  }

  console.warn('handling request without jwt token');
  return next(request);
}
