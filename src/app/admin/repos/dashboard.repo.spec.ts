import { TestBed } from '@angular/core/testing';

import { AdminDashboardRepo } from './dashboard.repo';

describe('AdminDashboardRepo', () => {
  let service: AdminDashboardRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
