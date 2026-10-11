import { inject } from '@angular/core'
import { type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { environments } from 'src/environments/environment'
import { ToastService } from '../shared/ui/toast.service'

export const errorHandlerInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router)
  const toast = inject(ToastService)
  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const role = request.url.slice(environments.baseUrl.length).split('/')[0]
      if (role === 'theater' && err.status === 403) {
        void router.navigate(['/theater/approval/rejected'], {
          queryParams: { reason: 'Block' }
        })
      }
      const message: unknown = err.error?.message
      if (err.status === 0) {
        toast.error('Can\'t reach CineSnap', 'Check your connection and try again.')
      } else {
        toast.error(typeof message === 'string' && message !== '' ? message : 'Something went wrong', err.statusText !== '' && err.statusText !== 'OK' ? err.statusText : undefined)
      }
      return throwError(() => err)
    })
  )
}
