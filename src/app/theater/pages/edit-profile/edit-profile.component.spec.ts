import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterEditProfileComponent } from './edit-profile.component';

describe('TheaterEditProfileComponent', () => {
  let component: TheaterEditProfileComponent;
  let fixture: ComponentFixture<TheaterEditProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterEditProfileComponent]
});
    fixture = TestBed.createComponent(TheaterEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
