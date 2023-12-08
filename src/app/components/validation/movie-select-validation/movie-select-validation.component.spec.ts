import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSelectValidationComponent } from './movie-select-validation.component';

describe('MovieSelectValidationComponent', () => {
  let component: MovieSelectValidationComponent;
  let fixture: ComponentFixture<MovieSelectValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieSelectValidationComponent]
    });
    fixture = TestBed.createComponent(MovieSelectValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
