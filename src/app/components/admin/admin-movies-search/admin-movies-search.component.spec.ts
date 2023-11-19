import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMoviesSearchComponent } from './admin-movies-search.component';

describe('AdminMoviesSearchComponent', () => {
  let component: AdminMoviesSearchComponent;
  let fixture: ComponentFixture<AdminMoviesSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMoviesSearchComponent]
    });
    fixture = TestBed.createComponent(AdminMoviesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
