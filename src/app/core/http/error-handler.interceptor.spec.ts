import { TestBed } from '@angular/core/testing';
import { type HttpInterceptorFn } from '@angular/common/http';

import { errorHandlerInterceptor } from './error-handler.interceptor';

describe('errorHandlerInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorHandlerInterceptor(req, next));

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
