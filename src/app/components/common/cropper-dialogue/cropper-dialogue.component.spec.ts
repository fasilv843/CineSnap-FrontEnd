import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperDialogueComponent } from './cropper-dialogue.component';

describe('CropperDialogueComponent', () => {
  let component: CropperDialogueComponent;
  let fixture: ComponentFixture<CropperDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CropperDialogueComponent]
    });
    fixture = TestBed.createComponent(CropperDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
