import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessagesComponent } from './admin-messages.component';

describe('AdminMessagesComponent', () => {
  let component: AdminMessagesComponent;
  let fixture: ComponentFixture<AdminMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMessagesComponent]
    });
    fixture = TestBed.createComponent(AdminMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
