import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterTicketsComponent } from './tickets.component';

describe('TheaterTicketsComponent', () => {
  let component: TheaterTicketsComponent;
  let fixture: ComponentFixture<TheaterTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterTicketsComponent]
});
    fixture = TestBed.createComponent(TheaterTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
