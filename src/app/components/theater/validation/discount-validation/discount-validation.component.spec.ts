import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountValidationComponent } from './discount-validation.component';

describe('DiscountValidationComponent', () => {
  let component: DiscountValidationComponent;
  let fixture: ComponentFixture<DiscountValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DiscountValidationComponent]
    });
    fixture = TestBed.createComponent(DiscountValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
