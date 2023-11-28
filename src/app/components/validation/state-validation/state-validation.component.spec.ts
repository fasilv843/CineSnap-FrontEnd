import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateValidationComponent } from './state-validation.component';

describe('StateValidationComponent', () => {
  let component: StateValidationComponent;
  let fixture: ComponentFixture<StateValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateValidationComponent]
    });
    fixture = TestBed.createComponent(StateValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
