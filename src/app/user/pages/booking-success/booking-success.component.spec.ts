import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingSuccessComponent } from './booking-success.component';

describe('UserBookingSuccessComponent', () => {
  let component: UserBookingSuccessComponent;
  let fixture: ComponentFixture<UserBookingSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserBookingSuccessComponent]
});
    fixture = TestBed.createComponent(UserBookingSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
