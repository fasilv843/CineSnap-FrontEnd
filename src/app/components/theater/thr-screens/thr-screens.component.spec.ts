import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrScreensComponent } from './thr-screens.component';

describe('ThrScreensComponent', () => {
  let component: ThrScreensComponent;
  let fixture: ComponentFixture<ThrScreensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrScreensComponent]
    });
    fixture = TestBed.createComponent(ThrScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
