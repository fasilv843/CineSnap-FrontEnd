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
  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('Bypass-Interceptor')) {
      const bypassedRequest = request.clone({
        headers: request.headers.delete('bypass-interceptor')
      })
      console.log(bypassedRequest.headers, 'handling request')
      return next.handle(bypassedRequest)
    }
    const { baseUrl } = environments
    const newReq = request.clone(
      { url: baseUrl + request.url }
    )
    console.log(newReq.url, 'new url from interceptor')
    return next.handle(newReq)
  }
}
