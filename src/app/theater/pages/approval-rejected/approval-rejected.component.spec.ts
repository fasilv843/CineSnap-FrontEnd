import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterApprovalRejectedComponent } from './approval-rejected.component';

describe('TheaterApprovalRejectedComponent', () => {
  let component: TheaterApprovalRejectedComponent;
  let fixture: ComponentFixture<TheaterApprovalRejectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterApprovalRejectedComponent]
});
    fixture = TestBed.createComponent(TheaterApprovalRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
