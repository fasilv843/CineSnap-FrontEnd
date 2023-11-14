/* eslint-disable @typescript-eslint/semi */
import { Injectable } from '@angular/core'
import {
  type HttpRequest,
  type HttpHandler,
  type HttpEvent,
  type HttpInterceptor
} from '@angular/common/http'
import { type Observable } from 'rxjs'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor (
    private readonly router: Router
  ) {}

  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log(request.url)
    if (request.headers.has('Bypass-Interceptor')) {
      // request.headers.delete('Bypass-Interceptor')
      request.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200')
      return next.handle(request)
    }

    const user = request.url.split('/')[0];
    console.log('user:', user);

    const jwt = localStorage.getItem(user + 'Token');
    console.log('jwt:', jwt);

    let authorizedRequest: HttpRequest<unknown>;

    if (jwt != null) {
      authorizedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });

      console.log('Authorized Request:', authorizedRequest);

      return next.handle(authorizedRequest);
    } else {
      console.warn('JWT not found in localStorage. Making the request without Authorization header.');
      return next.handle(request);
    }

    // const user = request.url.split('/')[0]
    // console.log('user : ', user)
    // const jwt = localStorage.getItem(user + 'Token')
    // let authorizedRequest: HttpRequest<unknown>
    // if (jwt != null) {
    //   authorizedRequest = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${jwt}`
    //     }
    //   })
    //   console.log(authorizedRequest)
    //   return next.handle(authorizedRequest)
    // } else {
    //   return next.handle(request)
    // }
  }
}
