import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { ImageCropperComponent, type ImageCroppedEvent } from 'ngx-image-cropper'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'

export interface CropperDialogueResult {
  blob: Blob
  imageUrl: string
}

/** Square crop of a picked photo. Set `image` before it renders; closes with a CropperDialogueResult. */
@Component({
  selector: 'app-cropper-dialogue',
  imports: [ImageCropperComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card mx-auto w-[min(32rem,calc(100vw-2rem))] p-6 shadow-raised" role="dialog" aria-labelledby="crop-title">
      <h2 id="crop-title" class="text-xl font-semibold">Crop your photo</h2>
      <p class="mt-1 text-sm text-muted">Drag the square to choose what shows.</p>
      <div class="mt-4 overflow-hidden rounded-control bg-muted">
        @if (image(); as file) {
          <image-cropper [imageFile]="file" [maintainAspectRatio]="true" [aspectRatio]="1" [resizeToWidth]="400" [resizeToHeight]="400"
            format="jpeg" (imageCropped)="cropped($event)" (loadImageFailed)="failed.set(true)" />
        }
      </div>
      @if (failed()) {
        <p class="mt-2 text-sm text-danger" role="alert">That file couldn't be opened. Pick a JPG or PNG photo.</p>
      }
      <div class="mt-5 flex justify-end gap-2">
        <button csButton variant="ghost" type="button" (click)="modal.dismiss('cancel')">Cancel</button>
        <button csButton type="button" [disabled]="!result()" (click)="modal.close(result())">Use photo</button>
      </div>
    </div>
  `
})
export class ImageCropperDialogComponent {
  protected readonly modal = inject(ActiveModal)
  readonly image = signal<File | null>(null)
  protected readonly result = signal<CropperDialogueResult | undefined>(undefined)
  protected readonly failed = signal(false)

  protected cropped (event: ImageCroppedEvent): void {
    if (event.blob != null && event.objectUrl != null) this.result.set({ blob: event.blob, imageUrl: event.objectUrl })
  }
}
