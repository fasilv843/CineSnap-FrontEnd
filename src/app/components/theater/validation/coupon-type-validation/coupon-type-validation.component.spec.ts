import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponTypeValidationComponent } from './coupon-type-validation.component';

describe('CouponTypeValidationComponent', () => {
  let component: CouponTypeValidationComponent;
  let fixture: ComponentFixture<CouponTypeValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponTypeValidationComponent]
    });
    fixture = TestBed.createComponent(CouponTypeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
