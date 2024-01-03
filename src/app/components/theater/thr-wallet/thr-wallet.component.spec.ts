import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrWalletComponent } from './thr-wallet.component';

describe('ThrWalletComponent', () => {
  let component: ThrWalletComponent;
  let fixture: ComponentFixture<ThrWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrWalletComponent]
    });
    fixture = TestBed.createComponent(ThrWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
