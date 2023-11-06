import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwt = localStorage.getItem('jwt')
    let autherizedRequest: HttpRequest<unknown>;
    if(jwt){

      autherizedRequest = request.clone({
        setHeaders: {
          Autherization : `Bearer ${jwt}`
        }
      });

      return next.handle(autherizedRequest);

    }else{

      this.router.navigate(['/user/login'])
      
      // Return an observable that immediately completes without making the original request
      return empty();
    }
  }
}
