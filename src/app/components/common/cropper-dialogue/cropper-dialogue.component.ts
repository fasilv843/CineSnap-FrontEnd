import { CommonModule } from '@angular/common'
import { Component, type OnInit, inject, signal } from '@angular/core'
import { ImageCropperModule, type ImageCroppedEvent } from 'ngx-image-cropper'
import { ActiveModal } from 'src/app/services/modal.service'

export interface CropperDialogueData {
  image: File
  width: number
  hieght: number
}

export interface CropperDialogueResult {
  blob: Blob
  imageUrl: string
}

@Component({
    imports: [
        CommonModule,
        ImageCropperModule
    ],
    selector: 'app-cropper-dialogue',
    templateUrl: './cropper-dialogue.component.html',
    styleUrls: ['./cropper-dialogue.component.css']
})
export class CropperDialogueComponent implements OnInit {
  ngOnInit (): void {
    console.log(this.data, 'data from cropped dialogue')
  }

  // set by the opener through componentInstance
  data!: CropperDialogueData
  activeModal = inject(ActiveModal)
  result = signal<CropperDialogueResult | undefined>(undefined)

  imageCropped (event: ImageCroppedEvent): void {
    const { blob, objectUrl } = event
    console.log(blob, 'blob from imageCropped')
    console.log(objectUrl, 'objectUrl from imageCropped')

    if ((blob != null) && (objectUrl != null)) {
      this.result.set({ blob, imageUrl: objectUrl })
    }
  }
}
