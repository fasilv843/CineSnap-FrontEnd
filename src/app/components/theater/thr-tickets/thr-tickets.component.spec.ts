import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrTicketsComponent } from './thr-tickets.component';

describe('ThrTicketsComponent', () => {
  let component: ThrTicketsComponent;
  let fixture: ComponentFixture<ThrTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrTicketsComponent]
    });
    fixture = TestBed.createComponent(ThrTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
