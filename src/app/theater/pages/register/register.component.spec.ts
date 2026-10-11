import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterRegisterComponent } from './register.component';

describe('TheaterRegisterComponent', () => {
  let component: TheaterRegisterComponent;
  let fixture: ComponentFixture<TheaterRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterRegisterComponent]
});
    fixture = TestBed.createComponent(TheaterRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
