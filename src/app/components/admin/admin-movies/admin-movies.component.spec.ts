import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMoviesComponent } from './admin-movies.component';

describe('AdminMoviesComponent', () => {
  let component: AdminMoviesComponent;
  let fixture: ComponentFixture<AdminMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMoviesComponent]
    });
    fixture = TestBed.createComponent(AdminMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
