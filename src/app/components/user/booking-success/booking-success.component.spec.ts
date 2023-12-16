import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessComponent } from './booking-success.component';

describe('BookingSuccessComponent', () => {
  let component: BookingSuccessComponent;
  let fixture: ComponentFixture<BookingSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSuccessComponent]
    });
    fixture = TestBed.createComponent(BookingSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
