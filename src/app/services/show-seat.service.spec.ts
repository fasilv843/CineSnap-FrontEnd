import { TestBed } from '@angular/core/testing';

import { ShowSeatService } from './show-seat.service';

describe('ShowSeatService', () => {
  let service: ShowSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
