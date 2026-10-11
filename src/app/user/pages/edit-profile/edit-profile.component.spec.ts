import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfileComponent } from './edit-profile.component';

describe('UserEditProfileComponent', () => {
  let component: UserEditProfileComponent;
  let fixture: ComponentFixture<UserEditProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserEditProfileComponent]
});
    fixture = TestBed.createComponent(UserEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
