import { TestBed } from '@angular/core/testing';
import { type HttpInterceptorFn } from '@angular/common/http';

import { transformUrlInterceptor } from './transform-url.interceptor';

describe('transformUrlInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => transformUrlInterceptor(req, next));

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
