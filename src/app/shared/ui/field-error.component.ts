import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { type ValidationError } from '@angular/forms/signals'

/** Any signal-forms field: calling it gives its state, whose errors carry their messages */
type ErrorSource = () => { errors: () => readonly ValidationError[] }

/**
 * Shows the first validation message for a field once the form is submitted.
 * <cs-field-error [field]="form.email" [submitted]="submitted()" />
 * Messages come from the form's rules (see shared/utils/form-rules.ts).
 */
@Component({
  selector: 'cs-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message(); as text) {
      <p class="mt-1 text-sm text-danger" role="alert">{{ text }}</p>
    }
  `
})
export class FieldErrorComponent {
  readonly field = input.required<ErrorSource>()
  readonly submitted = input(false)

  protected readonly message = computed(() => {
    if (!this.submitted()) return null
    const [error] = this.field()().errors()
    return error === undefined ? null : error.message ?? 'This value is not valid'
  })
}
