import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckoutComponent } from './checkout.component';

describe('UserCheckoutComponent', () => {
  let component: UserCheckoutComponent;
  let fixture: ComponentFixture<UserCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserCheckoutComponent]
});
    fixture = TestBed.createComponent(UserCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
