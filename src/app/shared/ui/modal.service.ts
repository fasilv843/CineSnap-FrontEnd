import { Injectable, inject, type Type } from '@angular/core'
import { Dialog, type DialogRef } from '@angular/cdk/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { firstValueFrom } from 'rxjs'

type ModalOutcome =
  | { type: 'close', value: any }
  | { type: 'dismiss', reason: any }

export interface ModalOptions {
  variant?: 'modal' | 'offcanvas'
  /** when true, clicking the backdrop or pressing Esc does not close the modal */
  static?: boolean
  width?: string
}

export interface AppModalRef<T> {
  componentInstance: T
  /** resolves with the value passed to close(), rejects with the reason passed to dismiss() */
  result: Promise<any>
}

/** Injected into a component opened through ModalService to close it */
export class ActiveModal {
  constructor (private readonly dialogRef: DialogRef<ModalOutcome, any>) {}

  close (value?: any): void {
    this.dialogRef.close({ type: 'close', value })
  }

  dismiss (reason?: any): void {
    this.dialogRef.close({ type: 'dismiss', reason })
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly dialog = inject(Dialog)
  private readonly overlay = inject(Overlay)

  open<T>(component: Type<T>, options: ModalOptions = {}): AppModalRef<T> {
    const offcanvas = options.variant === 'offcanvas'

    const dialogRef = this.dialog.open<ModalOutcome, unknown, T>(component, {
      disableClose: options.static ?? false,
      hasBackdrop: true,
      backdropClass: 'app-modal-backdrop',
      panelClass: offcanvas ? 'app-offcanvas-panel' : 'app-modal-panel',
      width: offcanvas ? undefined : (options.width ?? '100%'),
      maxWidth: offcanvas ? undefined : '42rem',
      height: offcanvas ? '100%' : undefined,
      positionStrategy: offcanvas
        ? this.overlay.position().global().left('0').top('0')
        : this.overlay.position().global().centerHorizontally().centerVertically(),
      providers: (ref) => [{ provide: ActiveModal, useValue: new ActiveModal(ref) }]
    })

    const result = firstValueFrom(dialogRef.closed).then(outcome => {
      if (outcome?.type === 'close') return outcome.value
      // backdrop click / Esc close with no outcome counts as a dismissal
      throw outcome?.type === 'dismiss' ? outcome.reason : 'backdrop'
    })

    return { componentInstance: dialogRef.componentInstance as T, result }
  }
}
