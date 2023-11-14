import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTheatersComponent } from './admin-theaters.component';

describe('AdminTheatersComponent', () => {
  let component: AdminTheatersComponent;
  let fixture: ComponentFixture<AdminTheatersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTheatersComponent]
    });
    fixture = TestBed.createComponent(AdminTheatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
