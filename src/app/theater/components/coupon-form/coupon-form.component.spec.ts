import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponFormComponent } from './coupon-form.component';

describe('CouponFormComponent', () => {
  let component: CouponFormComponent;
  let fixture: ComponentFixture<CouponFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponFormComponent]
    });
    fixture = TestBed.createComponent(CouponFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
