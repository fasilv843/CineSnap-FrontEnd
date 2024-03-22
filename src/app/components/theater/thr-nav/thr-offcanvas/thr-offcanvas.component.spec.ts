import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrOffcanvasComponent } from './thr-offcanvas.component';

describe('ThrOffcanvasComponent', () => {
  let component: ThrOffcanvasComponent;
  let fixture: ComponentFixture<ThrOffcanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThrOffcanvasComponent]
    });
    fixture = TestBed.createComponent(ThrOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
