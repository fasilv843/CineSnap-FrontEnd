import { Component, EventEmitter, Input, Output, computed, effect, inject, signal } from '@angular/core'
import { CropperDialogueComponent, type CropperDialogueResult } from '../cropper-dialogue/cropper-dialogue.component'
import { ModalService } from 'src/app/services/modal.service'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-profile-dp',
    imports: [
        CommonModule,
        CropperDialogueComponent
    ],
    templateUrl: './profile-dp.component.html',
    styleUrls: ['./profile-dp.component.css']
})
export class ProfileDpComponent {
  imageWidth = signal(0)
  // eslint-disable-next-line accessor-pairs
  @Input() set width (val: number) {
    this.imageWidth.set(val)
  }

  @Input() currDp: string = ''

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
  modalService = inject(ModalService)

  fileSelected (event: any): void {
    const file = event.target.files[0]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (file) {
      const modalRef = this.modalService.open(CropperDialogueComponent, { width: '500px' })
      modalRef.componentInstance.data = { image: file, width: this.imageWidth(), hieght: this.imageHeight() }

      void modalRef.result.then(
        (result: CropperDialogueResult | undefined) => {
          if (result !== undefined) this.croppedImage.set(result)
        },
        () => {}
      )
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

  @Output() deleteDp = new EventEmitter()

  deleteProfilePic (): void {
    this.croppedImage.set(undefined)
    this.deleteDp.emit()
    this.currDp = ''
  }
}
