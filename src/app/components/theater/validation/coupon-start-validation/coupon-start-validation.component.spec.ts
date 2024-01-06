import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponStartValidationComponent } from './coupon-start-validation.component';

describe('CouponStartValidationComponent', () => {
  let component: CouponStartValidationComponent;
  let fixture: ComponentFixture<CouponStartValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponStartValidationComponent]
    });
    fixture = TestBed.createComponent(CouponStartValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
