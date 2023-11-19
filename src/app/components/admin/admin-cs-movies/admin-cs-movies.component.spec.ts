import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCsMoviesComponent } from './admin-cs-movies.component';

describe('AdminCsMoviesComponent', () => {
  let component: AdminCsMoviesComponent;
  let fixture: ComponentFixture<AdminCsMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCsMoviesComponent]
    });
    fixture = TestBed.createComponent(AdminCsMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
