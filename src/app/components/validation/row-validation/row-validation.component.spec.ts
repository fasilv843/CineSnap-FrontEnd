import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowValidationComponent } from './row-validation.component';

describe('RowValidationComponent', () => {
  let component: RowValidationComponent;
  let fixture: ComponentFixture<RowValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RowValidationComponent]
    });
    fixture = TestBed.createComponent(RowValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
