import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpValidationComponent } from './otp-validation.component';

describe('OtpValidationComponent', () => {
  let component: OtpValidationComponent;
  let fixture: ComponentFixture<OtpValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpValidationComponent]
    });
    fixture = TestBed.createComponent(OtpValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
