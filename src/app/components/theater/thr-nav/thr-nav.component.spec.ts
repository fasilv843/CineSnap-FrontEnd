import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrNavComponent } from './thr-nav.component';

describe('ThrNavComponent', () => {
  let component: ThrNavComponent;
  let fixture: ComponentFixture<ThrNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrNavComponent]
    });
    fixture = TestBed.createComponent(ThrNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
