import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTimeValidationComponent } from './start-time-validation.component';

describe('StartTimeValidationComponent', () => {
  let component: StartTimeValidationComponent;
  let fixture: ComponentFixture<StartTimeValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartTimeValidationComponent]
    });
    fixture = TestBed.createComponent(StartTimeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
