import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileDpComponent } from 'src/app/components/common/profile-dp/profile-dp.component'
import { CropperDialogueComponent } from 'src/app/components/common/cropper-dialogue/cropper-dialogue.component'
import { ImageCropperModule } from 'ngx-image-cropper'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
  declarations: [
    ProfileDpComponent,
    CropperDialogueComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    ImageCropperModule,
    MatDialogModule
  ],
  exports: [
    ProfileDpComponent,
    CropperDialogueComponent
  ]
})
export class ImageModule { }
