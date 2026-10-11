import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMoviesComponent } from './movies.component';

describe('UserMoviesComponent', () => {
  let component: UserMoviesComponent;
  let fixture: ComponentFixture<UserMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserMoviesComponent]
});
    fixture = TestBed.createComponent(UserMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
