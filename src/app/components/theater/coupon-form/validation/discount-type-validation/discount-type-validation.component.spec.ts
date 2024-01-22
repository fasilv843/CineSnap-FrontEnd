import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTypeValidationComponent } from './discount-type-validation.component';

describe('DiscountTypeValidationComponent', () => {
  let component: DiscountTypeValidationComponent;
  let fixture: ComponentFixture<DiscountTypeValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DiscountTypeValidationComponent]
    });
    fixture = TestBed.createComponent(DiscountTypeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
