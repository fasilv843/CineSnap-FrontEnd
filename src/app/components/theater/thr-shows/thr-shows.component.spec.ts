import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrShowsComponent } from './thr-shows.component';

describe('ThrShowsComponent', () => {
  let component: ThrShowsComponent;
  let fixture: ComponentFixture<ThrShowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrShowsComponent]
    });
    fixture = TestBed.createComponent(ThrShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
