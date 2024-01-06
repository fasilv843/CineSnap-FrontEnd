import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCountValidationComponent } from './coupon-count-validation.component';

describe('CouponCountValidationComponent', () => {
  let component: CouponCountValidationComponent;
  let fixture: ComponentFixture<CouponCountValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponCountValidationComponent]
    });
    fixture = TestBed.createComponent(CouponCountValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
