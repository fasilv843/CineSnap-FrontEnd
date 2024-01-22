import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinTicketValidationComponent } from './min-ticket-validation.component';

describe('MinTicketValidationComponent', () => {
  let component: MinTicketValidationComponent;
  let fixture: ComponentFixture<MinTicketValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MinTicketValidationComponent]
    });
    fixture = TestBed.createComponent(MinTicketValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
