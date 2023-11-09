import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userLoginGuard } from './user-login.guard';

describe('userLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
