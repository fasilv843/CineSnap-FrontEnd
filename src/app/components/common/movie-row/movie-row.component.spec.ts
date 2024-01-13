import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieRowComponent } from './movie-row.component';

describe('MovieRowComponent', () => {
  let component: MovieRowComponent;
  let fixture: ComponentFixture<MovieRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovieRowComponent]
    });
    fixture = TestBed.createComponent(MovieRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
