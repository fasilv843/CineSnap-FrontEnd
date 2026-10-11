import { ChangeDetectionStrategy, Component, input } from '@angular/core'

/** Page title row: heading and one-line description, with actions projected on the right. */
@Component({
  selector: 'cs-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between' },
  template: `
    <div class="min-w-0">
      <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{{ heading() }}</h1>
      @if (description()) {
        <p class="mt-1 text-muted">{{ description() }}</p>
      }
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <ng-content />
    </div>
  `
})
export class PageHeaderComponent {
  readonly heading = input.required<string>()
  readonly description = input('')
}
