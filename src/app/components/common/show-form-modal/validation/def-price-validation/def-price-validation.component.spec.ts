import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefPriceValidationComponent } from './def-price-validation.component';

describe('DefPriceValidationComponent', () => {
  let component: DefPriceValidationComponent;
  let fixture: ComponentFixture<DefPriceValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefPriceValidationComponent]
    });
    fixture = TestBed.createComponent(DefPriceValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
