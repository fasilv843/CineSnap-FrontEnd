import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterWalletComponent } from './wallet.component';

describe('TheaterWalletComponent', () => {
  let component: TheaterWalletComponent;
  let fixture: ComponentFixture<TheaterWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterWalletComponent]
});
    fixture = TestBed.createComponent(TheaterWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
