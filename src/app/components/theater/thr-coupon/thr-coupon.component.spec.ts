import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ThrCouponComponent } from './thr-coupon.component'

describe('ThrCouponComponent', () => {
  let component: ThrCouponComponent
  let fixture: ComponentFixture<ThrCouponComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrCouponComponent]
    })
    fixture = TestBed.createComponent(ThrCouponComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
