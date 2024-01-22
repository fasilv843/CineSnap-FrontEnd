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

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.warn('error during api call', err)
        console.log('firing Swal with heading : ', err.statusText)
        void Swal.fire(err.statusText, err.error.message, 'error')
        return throwError(() => err)
      })
    )
  }
}
