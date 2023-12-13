import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessageComponent } from './user-message.component';

describe('UserMessageComponent', () => {
  let component: UserMessageComponent;
  let fixture: ComponentFixture<UserMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMessageComponent]
    });
    fixture = TestBed.createComponent(UserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
