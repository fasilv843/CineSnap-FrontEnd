import { TestBed } from '@angular/core/testing';

import { TheaterService } from './theater.service';

describe('TheaterService', () => {
  let service: TheaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
