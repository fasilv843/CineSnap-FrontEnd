import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTheaterProfileComponent } from './edit-theater-profile.component';

describe('EditTheaterProfileComponent', () => {
  let component: EditTheaterProfileComponent;
  let fixture: ComponentFixture<EditTheaterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTheaterProfileComponent]
    });
    fixture = TestBed.createComponent(EditTheaterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
