import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessagesComponent } from './messages.component';

describe('UserMessagesComponent', () => {
  let component: UserMessagesComponent;
  let fixture: ComponentFixture<UserMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserMessagesComponent]
});
    fixture = TestBed.createComponent(UserMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
