import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { LogoComponent } from './logo.component'
import { ThemeToggleComponent } from './theme-toggle.component'

/** Full-page message (approval pending, account blocked, …) with actions projected below it. */
@Component({
  selector: 'cs-status-page',
  imports: [LogoComponent, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh flex-col bg-page px-4 py-6 text-default sm:px-8">
      <div class="flex items-center justify-between">
        <cs-logo />
        <cs-theme-toggle />
      </div>
      <main class="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center py-12">
        <span class="badge" [attr.data-tone]="tone()">{{ label() }}</span>
        <h1 class="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">{{ heading() }}</h1>
        <div class="mt-4 space-y-3 text-lg text-muted">
          <ng-content select="[message]" />
        </div>
        <div class="mt-8 flex flex-wrap gap-2">
          <ng-content />
        </div>
      </main>
    </div>
  `,
  styles: `
    .badge[data-tone='warning'] { background: color-mix(in srgb, var(--color-warning) 18%, transparent); color: var(--text-color-default); }
    .badge[data-tone='danger'] { background: color-mix(in srgb, var(--color-danger) 15%, transparent); color: var(--color-danger); }
  `
})
export class StatusPageComponent {
  readonly label = input.required<string>()
  readonly heading = input.required<string>()
  readonly tone = input<'warning' | 'danger'>('warning')
}
