import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterDashboardComponent } from './dashboard.component';

describe('TheaterDashboardComponent', () => {
  let component: TheaterDashboardComponent;
  let fixture: ComponentFixture<TheaterDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterDashboardComponent]
});
    fixture = TestBed.createComponent(TheaterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
