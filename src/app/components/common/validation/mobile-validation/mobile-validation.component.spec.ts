import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileValidationComponent } from './mobile-validation.component';

describe('MobileValidationComponent', () => {
  let component: MobileValidationComponent;
  let fixture: ComponentFixture<MobileValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileValidationComponent]
    });
    fixture = TestBed.createComponent(MobileValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
