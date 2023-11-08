// import { Injectable } from '@angular/core'
// import {
//   type HttpRequest,
//   type HttpHandler,
//   type HttpEvent,
//   type HttpInterceptor
// } from '@angular/common/http'
// import { type Observable, empty, of } from 'rxjs'
// // eslint-disable-next-line @typescript-eslint/consistent-type-imports
// import { Router } from '@angular/router'

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor (
//     private readonly router: Router
//   ) {}

//   intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const jwt = localStorage.getItem('jwt')
//     let autherizedRequest: HttpRequest<unknown>
//     if (jwt != null) {
//       autherizedRequest = request.clone({
//         setHeaders: {
//           Autherization: `Bearer ${jwt}`
//         }
//       })

//       return next.handle(autherizedRequest)
//     } else {
//       void this.router.navigate(['/user/login'])

//       // Return an observable that immediately completes without making the original request
//       return empty()
//     }
//   }
// }
