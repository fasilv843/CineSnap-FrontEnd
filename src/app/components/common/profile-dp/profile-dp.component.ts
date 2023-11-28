import { Component, EventEmitter, Input, Output, computed, effect, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { CropperDialogueComponent, type CropperDialogueResult } from '../cropper-dialogue/cropper-dialogue.component'
import { filter } from 'rxjs'

@Component({
  selector: 'app-profile-dp',
  templateUrl: './profile-dp.component.html',
  styleUrls: ['./profile-dp.component.css']
})
export class ProfileDpComponent {
  imageWidth = signal(0)
  // eslint-disable-next-line accessor-pairs
  @Input() set width (val: number) {
    this.imageWidth.set(val)
  }

  imageHeight = signal(0)
  // eslint-disable-next-line accessor-pairs
  @Input() set hieght (val: number) {
    this.imageHeight.set(val)
  }

  placeholder = computed(() => 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200')

  imageSource = computed(() => {
    console.log(this.croppedImage(), 'croppedImage() returns this in imageSurce')
    return this.croppedImage()?.imageUrl ?? this.placeholder()
  })

  croppedImage = signal<CropperDialogueResult | undefined>(undefined)
  dialog = inject(MatDialog)

  fileSelected (event: any): void {
    const file = event.target.files[0]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (file) {
      const dialogRef = this.dialog.open(CropperDialogueComponent, {
        data: { image: file, width: this.imageWidth(), height: this.imageHeight() },
        width: '500px'
      })

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe(result => {
        this.croppedImage.set(result)
      })
    }
  }

  @Output() imageReady = new EventEmitter<Blob>()

  constructor () {
    effect(() => {
      if (this.croppedImage() !== undefined) {
        this.imageReady.emit(this.croppedImage()?.blob)
      }
    })
  }

  deleteProfilePic (): void {

  }
}
