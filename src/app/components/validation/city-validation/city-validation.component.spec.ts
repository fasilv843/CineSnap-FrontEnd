import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityValidationComponent } from './city-validation.component';

describe('CityValidationComponent', () => {
  let component: CityValidationComponent;
  let fixture: ComponentFixture<CityValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CityValidationComponent]
    });
    fixture = TestBed.createComponent(CityValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
