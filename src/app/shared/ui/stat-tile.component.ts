import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

/** One headline number with its label; shows a skeleton while loading and a retry link on error. */
@Component({
  selector: 'cs-stat-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card block p-5' },
  template: `
    <p class="text-sm text-muted">{{ label() }}</p>
    @if (error()) {
      <p class="mt-2 text-sm text-muted" role="alert">
        Couldn't load.
        <button type="button" class="font-semibold text-default underline decoration-accent underline-offset-4" (click)="retried.emit()">Try again</button>
      </p>
    } @else if (loading()) {
      <span class="skeleton mt-2 h-9 w-24"></span>
    } @else {
      <p class="mt-1 font-display text-4xl font-extrabold tabular-nums tracking-tight" [class.text-accent]="highlight()">{{ value() }}</p>
    }
    @if (hint()) {
      <p class="mt-1 text-xs text-subtle">{{ hint() }}</p>
    }
  `
})
export class StatTileComponent {
  readonly label = input.required<string>()
  readonly value = input<string | number>('')
  readonly hint = input('')
  readonly loading = input(false)
  readonly error = input(false)
  /** The one figure on the page that should draw the eye */
  readonly highlight = input(false)
  readonly retried = output()
}
