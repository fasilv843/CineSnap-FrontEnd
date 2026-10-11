import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { TheaterSeatingComponent } from './seating.component'

describe('TheaterSeatingComponent', () => {
  let component: TheaterSeatingComponent
  let fixture: ComponentFixture<TheaterSeatingComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterSeatingComponent]
})
    fixture = TestBed.createComponent(TheaterSeatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
