import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAmountValidationComponent } from './wallet-amount-validation.component';

describe('WalletAmountValidationComponent', () => {
  let component: WalletAmountValidationComponent;
  let fixture: ComponentFixture<WalletAmountValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WalletAmountValidationComponent]
    });
    fixture = TestBed.createComponent(WalletAmountValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
