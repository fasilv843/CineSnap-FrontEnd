import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { LogoComponent } from './logo.component'
import { ThemeToggleComponent } from './theme-toggle.component'

const SEAT_ROWS = 5
const SEAT_COLS = 10
const LIT = new Set(['1-4', '1-5', '2-2', '3-7', '3-8', '4-5'])

/** Two-panel frame for the sign-in and sign-up pages (user, theater, admin): a brand panel beside the form. */
@Component({
  selector: 'cs-auth-shell',
  imports: [LogoComponent, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid min-h-dvh bg-page text-default lg:grid-cols-[1fr_1.1fr]">
      <!-- Brand panel (wide screens only) -->
      <aside class="relative hidden flex-col justify-center gap-12 overflow-hidden bg-muted p-10 lg:flex" aria-hidden="true">
        <div>
          <p class="font-display text-5xl font-extrabold leading-[0.95] tracking-tight xl:text-6xl">{{ pitch() }}</p>
          <p class="mt-4 max-w-sm text-muted">{{ pitchDetail() }}</p>
        </div>
        <div class="seat-map">
          <div class="screen"></div>
          @for (row of rows; track row) {
            <div class="flex justify-center gap-2">
              @for (col of cols; track col) {
                <span class="seat" [class.seat-lit]="lit.has(row + '-' + col)" [class.aisle]="col === 4"></span>
              }
            </div>
          }
        </div>
      </aside>

      <!-- Form -->
      <main class="flex flex-col px-4 py-6 sm:px-8">
        <div class="flex items-center justify-between">
          <cs-logo />
          <cs-theme-toggle />
        </div>
        <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{{ heading() }}</h1>
          <p class="mt-2 text-muted">{{ subheading() }}</p>
          <div class="mt-8">
            <ng-content />
          </div>
        </div>
      </main>
    </div>
  `,
  styles: `
    .seat-map {
      display: grid;
      gap: 0.5rem;
    }

    .screen {
      height: 1.5rem;
      margin: 0 12% 0.75rem;
      border-top: 3px solid var(--text-color-default);
      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      opacity: 0.6;
    }

    .seat {
      width: 1.5rem;
      aspect-ratio: 1 / 0.9;
      border-radius: 0.375rem 0.375rem 0.2rem 0.2rem;
      background: var(--border-color-strong);
    }

    .seat.aisle {
      margin-right: 1rem;
    }

    .seat-lit {
      background: var(--color-accent);
      box-shadow: var(--shadow-glow);
    }
  `
})
export class AuthShellComponent {
  readonly heading = input.required<string>()
  readonly subheading = input('')
  /** Brand panel copy (wide screens); defaults to the movie-goer pitch */
  readonly pitch = input('Pick your seat before you leave home.')
  readonly pitchDetail = input('Shows at theaters near you, a live seat map, and tickets on your phone.')

  protected readonly rows = Array.from({ length: SEAT_ROWS }, (_, i) => i)
  protected readonly cols = Array.from({ length: SEAT_COLS }, (_, i) => i)
  protected readonly lit = LIT
}
