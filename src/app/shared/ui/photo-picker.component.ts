import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { CropperDialogueComponent, type CropperDialogueResult } from 'src/app/components/common/cropper-dialogue/cropper-dialogue.component'
import { ModalService } from 'src/app/services/modal.service'
import { AvatarComponent } from './avatar.component'
import { ButtonDirective } from './button.directive'

/** Profile photo with "Change photo" (pick → crop) and "Remove". The parent uploads and passes back the new src. */
@Component({
  selector: 'cs-photo-picker',
  imports: [AvatarComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap items-center gap-5' },
  template: `
    <div class="relative">
      <cs-avatar [name]="name()" [src]="src()" size="lg" class="rounded-full border-2 border-accent" />
      @if (busy()) {
        <span class="absolute inset-0 flex items-center justify-center rounded-full bg-scrim/60 text-on-media" aria-label="Saving photo">
          <span class="spinner size-6"></span>
        </span>
      }
    </div>
    <div class="flex flex-wrap gap-2">
      <input #file type="file" accept="image/*" class="sr-only" tabindex="-1" aria-hidden="true" (change)="pick($event)" />
      <button csButton variant="secondary" size="sm" type="button" [disabled]="busy()" (click)="file.value = ''; file.click()">
        {{ src() ? 'Change photo' : 'Add photo' }}
      </button>
      @if (src()) {
        <button csButton variant="danger" size="sm" type="button" [disabled]="busy()" (click)="removed.emit()">Remove</button>
      }
    </div>
  `
})
export class PhotoPickerComponent {
  private readonly modalService = inject(ModalService)

  readonly name = input.required<string>()
  readonly src = input<string | null>(null)
  readonly busy = input(false)
  readonly picked = output<Blob>()
  readonly removed = output()

  protected pick (event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file === undefined) return
    const ref = this.modalService.open(CropperDialogueComponent, { static: true })
    ref.componentInstance.image.set(file)
    ref.result.then((result: CropperDialogueResult | undefined) => {
      if (result !== undefined) this.picked.emit(result.blob)
    }, () => {})
  }
}
