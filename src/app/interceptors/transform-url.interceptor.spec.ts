import { TestBed } from '@angular/core/testing';

import { TransformUrlInterceptor } from './transform-url.interceptor';

describe('TransformUrlInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TransformUrlInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TransformUrlInterceptor = TestBed.inject(TransformUrlInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
