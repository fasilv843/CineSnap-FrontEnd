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
    console.log(request.url)
    if (request.headers.has('Bypass-Interceptor')) {
      // request.headers.delete('Bypass-Interceptor')
      request.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200')
      return next.handle(request)
    }
    // return next.handle(request)
    const jwt = localStorage.getItem('userToken')
    let authorizedRequest: HttpRequest<unknown>
    if (jwt != null) {
      authorizedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      })
      console.log(authorizedRequest)
      return next.handle(authorizedRequest)
    } else {
      return next.handle(request)
      // void this.router.navigate(['/user/login'])

      // Return an observable that immediately completes without making the original request
      // return empty()
    }
  }
}
