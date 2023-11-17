import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrMessagesComponent } from './thr-messages.component';

describe('ThrMessagesComponent', () => {
  let component: ThrMessagesComponent;
  let fixture: ComponentFixture<ThrMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrMessagesComponent]
    });
    fixture = TestBed.createComponent(ThrMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
