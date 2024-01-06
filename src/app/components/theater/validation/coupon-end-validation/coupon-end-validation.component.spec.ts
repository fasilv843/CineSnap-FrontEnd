import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponEndValidationComponent } from './coupon-end-validation.component';

describe('CouponEndValidationComponent', () => {
  let component: CouponEndValidationComponent;
  let fixture: ComponentFixture<CouponEndValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponEndValidationComponent]
    });
    fixture = TestBed.createComponent(CouponEndValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
