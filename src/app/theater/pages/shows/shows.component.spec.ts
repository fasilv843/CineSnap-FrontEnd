import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterShowsComponent } from './shows.component';

describe('TheaterShowsComponent', () => {
  let component: TheaterShowsComponent;
  let fixture: ComponentFixture<TheaterShowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterShowsComponent]
});
    fixture = TestBed.createComponent(TheaterShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
