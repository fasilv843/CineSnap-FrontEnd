import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColValidationComponent } from './col-validation.component';

describe('ColValidationComponent', () => {
  let component: ColValidationComponent;
  let fixture: ComponentFixture<ColValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColValidationComponent]
    });
    fixture = TestBed.createComponent(ColValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
