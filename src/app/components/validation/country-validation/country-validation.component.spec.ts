import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryValidationComponent } from './country-validation.component';

describe('CountryValidationComponent', () => {
  let component: CountryValidationComponent;
  let fixture: ComponentFixture<CountryValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryValidationComponent]
    });
    fixture = TestBed.createComponent(CountryValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
