import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenNameValidationComponent } from './screen-name-validation.component';

describe('ScreenNameValidationComponent', () => {
  let component: ScreenNameValidationComponent;
  let fixture: ComponentFixture<ScreenNameValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenNameValidationComponent]
    });
    fixture = TestBed.createComponent(ScreenNameValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
