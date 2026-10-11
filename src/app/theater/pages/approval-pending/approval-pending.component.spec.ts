import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterApprovalPendingComponent } from './approval-pending.component';

describe('TheaterApprovalPendingComponent', () => {
  let component: TheaterApprovalPendingComponent;
  let fixture: ComponentFixture<TheaterApprovalPendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterApprovalPendingComponent]
});
    fixture = TestBed.createComponent(TheaterApprovalPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
