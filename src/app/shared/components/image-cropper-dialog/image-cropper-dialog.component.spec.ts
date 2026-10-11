import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperDialogComponent } from './image-cropper-dialog.component';

describe('ImageCropperDialogComponent', () => {
  let component: ImageCropperDialogComponent;
  let fixture: ComponentFixture<ImageCropperDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ImageCropperDialogComponent]
});
    fixture = TestBed.createComponent(ImageCropperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
