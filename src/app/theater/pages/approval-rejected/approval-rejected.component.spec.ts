import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRejectedComponent } from './approval-rejected.component';

describe('ApprovalRejectedComponent', () => {
  let component: ApprovalRejectedComponent;
  let fixture: ComponentFixture<ApprovalRejectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ApprovalRejectedComponent]
});
    fixture = TestBed.createComponent(ApprovalRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
