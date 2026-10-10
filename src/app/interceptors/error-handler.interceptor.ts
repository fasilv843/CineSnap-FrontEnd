import { inject } from '@angular/core'
import { type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { environments } from 'src/environments/environment'

export const errorHandlerInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router)
  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const role = request.url.slice(environments.baseUrl.length).split('/')[0]
      if (role === 'theater' && err.status === 403) {
        void router.navigate(['/theater/approval/rejected'], {
          queryParams: { reason: 'Block' }
        })
      }
      void Swal.fire(err.statusText, err.error.message, 'error')
      return throwError(() => err)
    })
  )
}
