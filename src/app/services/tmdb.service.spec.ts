import { TestBed } from '@angular/core/testing';

import { TMDBService } from './tmdb.service';

describe('TMDBService', () => {
  let service: TMDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TMDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
