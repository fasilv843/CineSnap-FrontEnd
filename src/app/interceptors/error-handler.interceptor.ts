import { Injectable } from '@angular/core'
import {
  type HttpRequest,
  type HttpHandler,
  type HttpEvent,
  type HttpInterceptor,
  type HttpErrorResponse
} from '@angular/common/http'
import { catchError, throwError, type Observable } from 'rxjs'

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('error is here, from interceptor')
        console.log('error during api calls', error)
        return throwError(() => error)
      })
    )
  }
}
