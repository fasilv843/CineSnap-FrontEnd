import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSeatsComponent } from './show-seats.component';

describe('ShowSeatsComponent', () => {
  let component: ShowSeatsComponent;
  let fixture: ComponentFixture<ShowSeatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowSeatsComponent]
    });
    fixture = TestBed.createComponent(ShowSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
