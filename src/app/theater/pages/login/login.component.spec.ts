import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterLoginComponent } from './login.component';

describe('TheaterLoginComponent', () => {
  let component: TheaterLoginComponent;
  let fixture: ComponentFixture<TheaterLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterLoginComponent]
});
    fixture = TestBed.createComponent(TheaterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
