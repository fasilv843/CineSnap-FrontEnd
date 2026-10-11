import { TestBed } from '@angular/core/testing';

import { AuthRepo } from './auth.repo';

describe('AuthRepo', () => {
  let service: AuthRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
