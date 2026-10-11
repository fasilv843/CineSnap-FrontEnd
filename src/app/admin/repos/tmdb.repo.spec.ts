import { TestBed } from '@angular/core/testing';

import { AdminTmdbRepo } from './tmdb.repo';

describe('AdminTmdbRepo', () => {
  let service: AdminTmdbRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTmdbRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
