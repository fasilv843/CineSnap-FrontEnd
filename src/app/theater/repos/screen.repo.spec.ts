import { TestBed } from '@angular/core/testing';

import { TheaterScreenRepo } from './screen.repo';

describe('TheaterScreenRepo', () => {
  let service: TheaterScreenRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheaterScreenRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
