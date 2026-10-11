import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ToastService } from './toast.service'

/** Renders the toast stack. Mount once, in the app root. */
@Component({
  selector: 'cs-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-x-0 bottom-20 z-[1100] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:left-auto sm:right-4 sm:top-20 sm:items-end' },
  template: `
    <div class="contents" aria-live="polite">
      @for (toast of toasts(); track toast.id) {
        <div class="toast pointer-events-auto card flex w-full max-w-sm items-start gap-3 p-4 shadow-raised" [attr.data-tone]="toast.tone"
          [attr.role]="toast.tone === 'danger' ? 'alert' : 'status'">
          <span class="mt-1.5 size-2.5 shrink-0 rounded-full dot" aria-hidden="true"></span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="mt-0.5 text-sm text-muted">{{ toast.message }}</p>
            }
          </div>
          <button type="button" class="-m-1 rounded-control p-1 text-muted hover:text-default" (click)="dismiss(toast.id)" aria-label="Dismiss">
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast {
      border-left-width: 4px;
      animation: toast-in 180ms ease-out;
    }

    .toast[data-tone='success'] { border-left-color: var(--color-success); }
    .toast[data-tone='success'] .dot { background: var(--color-success); }
    .toast[data-tone='danger'] { border-left-color: var(--color-danger); }
    .toast[data-tone='danger'] .dot { background: var(--color-danger); }
    .toast[data-tone='info'] { border-left-color: var(--color-info); }
    .toast[data-tone='info'] .dot { background: var(--color-info); }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(0.5rem); }
      to { opacity: 1; transform: none; }
    }
  `
})
export class ToastHostComponent {
  private readonly toastService = inject(ToastService)
  protected readonly toasts = this.toastService.toasts

  protected dismiss (id: number): void {
    this.toastService.dismiss(id)
  }
}
