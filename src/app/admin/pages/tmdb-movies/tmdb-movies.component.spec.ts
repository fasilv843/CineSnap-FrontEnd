import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTmdbMoviesComponent } from './tmdb-movies.component';

describe('AdminTmdbMoviesComponent', () => {
  let component: AdminTmdbMoviesComponent;
  let fixture: ComponentFixture<AdminTmdbMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AdminTmdbMoviesComponent]
});
    fixture = TestBed.createComponent(AdminTmdbMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
