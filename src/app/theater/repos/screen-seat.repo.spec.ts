import { TestBed } from '@angular/core/testing';

import { ScreenSeatService } from './screen-seat.service';

describe('ScreenSeatService', () => {
  let service: ScreenSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
