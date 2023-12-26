import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTicketsComponent } from './admin-tickets.component';

describe('AdminTicketsComponent', () => {
  let component: AdminTicketsComponent;
  let fixture: ComponentFixture<AdminTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTicketsComponent]
    });
    fixture = TestBed.createComponent(AdminTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
