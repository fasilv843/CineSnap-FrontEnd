import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatPassValidationComponent } from './repeat-pass-validation.component';

describe('RepeatPassValidationComponent', () => {
  let component: RepeatPassValidationComponent;
  let fixture: ComponentFixture<RepeatPassValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepeatPassValidationComponent]
    });
    fixture = TestBed.createComponent(RepeatPassValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
