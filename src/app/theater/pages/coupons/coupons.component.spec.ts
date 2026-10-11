import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { TheaterCouponsComponent } from './coupons.component'

describe('TheaterCouponsComponent', () => {
  let component: TheaterCouponsComponent
  let fixture: ComponentFixture<TheaterCouponsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterCouponsComponent]
})
    fixture = TestBed.createComponent(TheaterCouponsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
