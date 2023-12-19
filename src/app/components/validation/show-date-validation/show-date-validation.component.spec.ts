import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDateValidationComponent } from './show-date-validation.component';

describe('ShowDateValidationComponent', () => {
  let component: ShowDateValidationComponent;
  let fixture: ComponentFixture<ShowDateValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowDateValidationComponent]
    });
    fixture = TestBed.createComponent(ShowDateValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
