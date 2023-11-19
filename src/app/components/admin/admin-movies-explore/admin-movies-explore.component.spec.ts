import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMoviesExploreComponent } from './admin-movies-explore.component';

describe('AdminMoviesExploreComponent', () => {
  let component: AdminMoviesExploreComponent;
  let fixture: ComponentFixture<AdminMoviesExploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMoviesExploreComponent]
    });
    fixture = TestBed.createComponent(AdminMoviesExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
