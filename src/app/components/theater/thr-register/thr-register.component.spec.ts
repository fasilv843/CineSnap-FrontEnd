import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrRegisterComponent } from './thr-register.component';

describe('ThrRegisterComponent', () => {
  let component: ThrRegisterComponent;
  let fixture: ComponentFixture<ThrRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrRegisterComponent]
    });
    fixture = TestBed.createComponent(ThrRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
