import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxDiscountValidationComponent } from './max-discount-validation.component';

describe('MaxDiscountValidationComponent', () => {
  let component: MaxDiscountValidationComponent;
  let fixture: ComponentFixture<MaxDiscountValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaxDiscountValidationComponent]
    });
    fixture = TestBed.createComponent(MaxDiscountValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
