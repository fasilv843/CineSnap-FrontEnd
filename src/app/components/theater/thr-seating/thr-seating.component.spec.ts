import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ThrSeatingComponent } from './thr-seating.component'

describe('ThrSeatingComponent', () => {
  let component: ThrSeatingComponent
  let fixture: ComponentFixture<ThrSeatingComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrSeatingComponent]
    })
    fixture = TestBed.createComponent(ThrSeatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
