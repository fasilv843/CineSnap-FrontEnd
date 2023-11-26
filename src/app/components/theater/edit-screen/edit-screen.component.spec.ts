import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScreenComponent } from './edit-screen.component';

describe('EditScreenComponent', () => {
  let component: EditScreenComponent;
  let fixture: ComponentFixture<EditScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditScreenComponent]
    });
    fixture = TestBed.createComponent(EditScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
