import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWalletComponent } from './user-wallet.component';

describe('UserWalletComponent', () => {
  let component: UserWalletComponent;
  let fixture: ComponentFixture<UserWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserWalletComponent]
});
    fixture = TestBed.createComponent(UserWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
