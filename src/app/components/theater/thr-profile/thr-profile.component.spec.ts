import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrProfileComponent } from './thr-profile.component';

describe('ThrProfileComponent', () => {
  let component: ThrProfileComponent;
  let fixture: ComponentFixture<ThrProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrProfileComponent]
    });
    fixture = TestBed.createComponent(ThrProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
