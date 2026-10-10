import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core'
import { ActiveModal, ModalService } from 'src/app/services/modal.service'
import { ButtonDirective } from './button.directive'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  /** 'danger' for destructive actions such as cancelling a booking */
  tone?: 'primary' | 'danger'
}

@Component({
  selector: 'cs-confirm-dialog',
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let o = options();
    <div class="card mx-auto w-[min(28rem,calc(100vw-2rem))] p-6 shadow-raised" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <h2 id="confirm-title" class="text-xl font-semibold">{{ o.title }}</h2>
      <p id="confirm-message" class="mt-2 text-muted">{{ o.message }}</p>
      <div class="mt-6 flex justify-end gap-2">
        <button type="button" csButton variant="ghost" (click)="modal.close(false)">{{ o.cancelLabel ?? 'Keep it' }}</button>
        <button type="button" csButton [class.confirm-danger]="o.tone === 'danger'" (click)="modal.close(true)">{{ o.confirmLabel }}</button>
      </div>
    </div>
  `,
  styles: `
    .confirm-danger {
      background-color: var(--color-danger);
      color: var(--color-danger-foreground);
    }

    .confirm-danger:hover {
      background-color: color-mix(in srgb, var(--color-danger) 85%, black);
    }
  `
})
export class ConfirmDialogComponent {
  protected readonly modal = inject(ActiveModal)
  readonly options = signal<ConfirmOptions>({ title: '', message: '', confirmLabel: 'OK' })
}

/** Asks the user to confirm an action. Resolves true only when they press the confirm button. */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly modalService = inject(ModalService)

  async confirm (options: ConfirmOptions): Promise<boolean> {
    const ref = this.modalService.open(ConfirmDialogComponent)
    ref.componentInstance.options.set(options)
    try {
      return await ref.result === true
    } catch {
      return false // dismissed with Esc or a backdrop click
    }
  }
}
