import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterMoviesComponent } from './movies.component';

describe('TheaterMoviesComponent', () => {
  let component: TheaterMoviesComponent;
  let fixture: ComponentFixture<TheaterMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterMoviesComponent]
});
    fixture = TestBed.createComponent(TheaterMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
