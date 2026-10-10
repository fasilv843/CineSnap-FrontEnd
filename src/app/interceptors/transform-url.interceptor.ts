import { type HttpInterceptorFn } from '@angular/common/http'
import { environments } from 'src/environments/environment'

export const transformUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.headers.has('Bypass-Interceptor')) {
    console.log('deleting bypass interceptor')
    const bypassedRequest = request.clone({
      headers: request.headers.delete('bypass-interceptor')
    })
    return next(bypassedRequest)
  }
  const { baseUrl } = environments
  const newReq = request.clone(
    { url: baseUrl + request.url }
  )
  console.log(newReq.url, 'new url from interceptor')
  return next(newReq)
}
