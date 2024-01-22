import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipValidationComponent } from './zip-validation.component';

describe('ZipValidationComponent', () => {
  let component: ZipValidationComponent;
  let fixture: ComponentFixture<ZipValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZipValidationComponent]
    });
    fixture = TestBed.createComponent(ZipValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
