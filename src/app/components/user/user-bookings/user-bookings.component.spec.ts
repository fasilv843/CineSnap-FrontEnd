import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingsComponent } from './user-bookings.component';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBookingsComponent]
    });
    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
