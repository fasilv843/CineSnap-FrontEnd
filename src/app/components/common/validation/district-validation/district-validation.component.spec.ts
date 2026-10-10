import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictValidationComponent } from './district-validation.component';

describe('DistrictValidationComponent', () => {
  let component: DistrictValidationComponent;
  let fixture: ComponentFixture<DistrictValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DistrictValidationComponent]
});
    fixture = TestBed.createComponent(DistrictValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
