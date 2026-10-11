import { type HttpInterceptorFn } from '@angular/common/http'
import { environments } from 'src/environments/environment'

/** Prefixes CineSnap API paths with the backend URL; requests marked Bypass-Interceptor go out as they are. */
export const transformUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.headers.has('Bypass-Interceptor')) {
    return next(request.clone({ headers: request.headers.delete('bypass-interceptor') }))
  }
  return next(request.clone({ url: environments.baseUrl + request.url }))
}
