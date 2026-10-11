import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToWalletModalComponent } from './add-to-wallet-modal.component';

describe('AddToWalletModalComponent', () => {
  let component: AddToWalletModalComponent;
  let fixture: ComponentFixture<AddToWalletModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddToWalletModalComponent]
    });
    fixture = TestBed.createComponent(AddToWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
