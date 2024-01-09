import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponModalComponent } from './coupon-modal.component';

describe('CouponModalComponent', () => {
  let component: CouponModalComponent;
  let fixture: ComponentFixture<CouponModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponModalComponent]
    });
    fixture = TestBed.createComponent(CouponModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
