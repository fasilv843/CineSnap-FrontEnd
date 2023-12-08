import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSelectValidationComponent } from './screen-select-validation.component';

describe('ScreenSelectValidationComponent', () => {
  let component: ScreenSelectValidationComponent;
  let fixture: ComponentFixture<ScreenSelectValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenSelectValidationComponent]
    });
    fixture = TestBed.createComponent(ScreenSelectValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
