import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DobValidationComponent } from './dob-validation.component';

describe('DobValidationComponent', () => {
  let component: DobValidationComponent;
  let fixture: ComponentFixture<DobValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DobValidationComponent]
    });
    fixture = TestBed.createComponent(DobValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
