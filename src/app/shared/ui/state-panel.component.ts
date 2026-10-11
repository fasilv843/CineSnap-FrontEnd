import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { ButtonDirective } from './button.directive'

/**
 * Empty or error message inside a card: <cs-state-panel heading="No shows yet" message="..." />.
 * With [retry]="true" it shows a "Try again" button that emits (retried).
 */
@Component({
  selector: 'cs-state-panel',
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between" [attr.role]="retry() ? 'alert' : null">
      <div>
        <p class="font-semibold">{{ heading() }}</p>
        @if (message()) {
          <p class="mt-1 text-muted">{{ message() }}</p>
        }
      </div>
      <div class="flex shrink-0 gap-2">
        @if (retry()) {
          <button csButton variant="secondary" size="sm" type="button" (click)="retried.emit()">Try again</button>
        }
        <ng-content />
      </div>
    </div>
  `
})
export class StatePanelComponent {
  readonly heading = input.required<string>()
  readonly message = input('')
  readonly retry = input(false)
  readonly retried = output()
}
