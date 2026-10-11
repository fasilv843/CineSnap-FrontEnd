import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCatalogComponent } from './movie-catalog.component';

describe('MovieCatalogComponent', () => {
  let component: MovieCatalogComponent;
  let fixture: ComponentFixture<MovieCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovieCatalogComponent]
    });
    fixture = TestBed.createComponent(MovieCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
