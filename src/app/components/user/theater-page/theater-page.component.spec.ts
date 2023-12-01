import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterPageComponent } from './theater-page.component';

describe('TheaterPageComponent', () => {
  let component: TheaterPageComponent;
  let fixture: ComponentFixture<TheaterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheaterPageComponent]
    });
    fixture = TestBed.createComponent(TheaterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
