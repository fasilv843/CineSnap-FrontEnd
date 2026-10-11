import { TestBed } from '@angular/core/testing';

import { TheaterScreenSeatRepo } from './screen-seat.repo';

describe('TheaterScreenSeatRepo', () => {
  let service: TheaterScreenSeatRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheaterScreenSeatRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
