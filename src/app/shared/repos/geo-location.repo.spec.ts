import { TestBed } from '@angular/core/testing';

import { GeoLocationRepo } from './geo-location.repo';

describe('GeoLocationRepo', () => {
  let service: GeoLocationRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoLocationRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
