import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrLoginComponent } from './thr-login.component';

describe('ThrLoginComponent', () => {
  let component: ThrLoginComponent;
  let fixture: ComponentFixture<ThrLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrLoginComponent]
    });
    fixture = TestBed.createComponent(ThrLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
