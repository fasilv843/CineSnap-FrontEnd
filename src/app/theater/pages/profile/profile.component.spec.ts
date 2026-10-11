import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterProfileComponent } from './profile.component';

describe('TheaterProfileComponent', () => {
  let component: TheaterProfileComponent;
  let fixture: ComponentFixture<TheaterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterProfileComponent]
});
    fixture = TestBed.createComponent(TheaterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
