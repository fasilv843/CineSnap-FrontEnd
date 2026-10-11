import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsMoviesComponent } from './cs-movies.component';

describe('CsMoviesComponent', () => {
  let component: CsMoviesComponent;
  let fixture: ComponentFixture<CsMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CsMoviesComponent]
    });
    fixture = TestBed.createComponent(CsMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
