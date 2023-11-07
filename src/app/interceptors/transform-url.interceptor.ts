import { Injectable } from '@angular/core'
import {
  type HttpRequest,
  type HttpHandler,
  type HttpEvent,
  type HttpInterceptor
} from '@angular/common/http'
import { type Observable } from 'rxjs'
import { environments } from 'src/environments/environment'

@Injectable()
export class TransformUrlInterceptor implements HttpInterceptor {
  // constructor () {}
  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { baseUrl } = environments
    const newReq = request.clone(
      { url: baseUrl + request.url }
    )
    return next.handle(newReq)
  }
}
