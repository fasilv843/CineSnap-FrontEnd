import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrMoviesComponent } from './thr-movies.component';

describe('ThrMoviesComponent', () => {
  let component: ThrMoviesComponent;
  let fixture: ComponentFixture<ThrMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrMoviesComponent]
    });
    fixture = TestBed.createComponent(ThrMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
