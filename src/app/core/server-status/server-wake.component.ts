import { ChangeDetectionStrategy, Component, type ElementRef, computed, effect, inject, viewChild } from '@angular/core'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { LogoComponent } from 'src/app/shared/ui/logo.component'
import { ServerStatusService } from './server-status.service'

/** Explains a free-hosting cold start while the server wakes up. Closable, so visitors can browse the UI without data. Mount once, in the app root. */
@Component({
  selector: 'app-server-wake',
  imports: [ButtonDirective, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'dismiss()' },
  template: `
    @if (visible()) {
      <div class="wake fixed inset-0 z-1050 grid place-items-center bg-scrim/60 p-4 backdrop-blur-sm">
        <div class="card relative w-full max-w-md p-6 shadow-raised" role="dialog" aria-modal="true" aria-labelledby="wake-title" aria-describedby="wake-message">
          <button type="button" class="absolute right-3 top-3 rounded-control p-1 text-muted hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            (click)="dismiss()" aria-label="Close">
            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>

          <cs-logo />
          <h2 id="wake-title" class="mt-5 text-xl font-semibold">Waking up the server</h2>
          <p id="wake-message" class="mt-2 text-muted">
            The CineSnap server is hosted on a free hosting service, which puts it to sleep after a few idle minutes.
            It's starting up now. This may take a moment.
          </p>

          <div class="mt-5 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Server start-up"
            aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="percent()">
            <div class="h-full rounded-full bg-primary transition-[width] duration-300 ease-out" [style.width.%]="percent()"></div>
          </div>

          @if (timedOut()) {
            <p class="mt-3 text-sm font-medium text-warning" role="status">The server didn't respond in time. It may still be starting, so try again in a moment.</p>
          }

          <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
            @if (timedOut()) {
              <button type="button" csButton variant="secondary" (click)="server.retry()">Try again</button>
            } @else {
              <p class="text-sm text-muted">Data loads automatically once it's up.</p>
            }
            <button #primary type="button" csButton (click)="dismiss()">Explore without data</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .wake { animation: wake-in 200ms ease-out; }

    @keyframes wake-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `
})
export class ServerWakeComponent {
  protected readonly server = inject(ServerStatusService)
  private readonly primary = viewChild<ElementRef<HTMLButtonElement>>('primary')

  protected readonly visible = computed(() => {
    const status = this.server.status()
    return (status === 'waking' || status === 'timeout') && !this.server.dismissed()
  })

  protected readonly timedOut = computed(() => this.server.status() === 'timeout')

  protected readonly percent = computed(() => Math.round(this.server.progress()))

  constructor () {
    effect(() => { this.primary()?.nativeElement.focus() })
  }

  protected dismiss (): void {
    if (this.visible()) this.server.dismiss()
  }
}
