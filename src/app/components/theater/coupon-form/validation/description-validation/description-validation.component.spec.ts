import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionValidationComponent } from './description-validation.component';

describe('DescriptionValidationComponent', () => {
  let component: DescriptionValidationComponent;
  let fixture: ComponentFixture<DescriptionValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DescriptionValidationComponent]
    });
    fixture = TestBed.createComponent(DescriptionValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
