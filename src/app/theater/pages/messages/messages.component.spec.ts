import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterMessagesComponent } from './messages.component';

describe('TheaterMessagesComponent', () => {
  let component: TheaterMessagesComponent;
  let fixture: ComponentFixture<TheaterMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterMessagesComponent]
});
    fixture = TestBed.createComponent(TheaterMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
