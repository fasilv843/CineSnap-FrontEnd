import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrHomeComponent } from './thr-home.component';

describe('ThrHomeComponent', () => {
  let component: ThrHomeComponent;
  let fixture: ComponentFixture<ThrHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrHomeComponent]
    });
    fixture = TestBed.createComponent(ThrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
