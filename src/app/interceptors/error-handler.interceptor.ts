/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import {
  type HttpRequest,
  type HttpHandler,
  type HttpEvent,
  type HttpInterceptor,
  type HttpErrorResponse
} from '@angular/common/http'
import { catchError, throwError, type Observable } from 'rxjs'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { environments } from 'src/environments/environment'

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor (
    private readonly _router: Router
  ) {}

  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.warn('error during api call', err)
        console.log('firing Swal with heading : ', err.statusText)
        const role = request.url.slice(environments.baseUrl.length).split('/')[0]
        console.log(request.url.slice(environments.baseUrl.length), 'url')
        console.log(role, 'role')
        console.error(err.status, 'err.status')
        if (role === 'theater' && err.status === 403) {
          console.error('redirecting to rejection page')
          void this._router.navigate(['/theater/approval/rejected'], {
            queryParams: { reason: 'Block' }
          })
        }
        void Swal.fire(err.statusText, err.error.message, 'error')
        return throwError(() => err)
      })
    )
  }
}
