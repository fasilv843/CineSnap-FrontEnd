import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

const defaultMessages: Record<string, string> = {
  required: 'This field is required',
  email: 'Enter a valid email address',
  pattern: 'Enter a value in the right format',
  minlength: 'This is too short',
  maxlength: 'This is too long',
  min: 'This value is too small',
  max: 'This value is too large',
  mismatch: 'The values don\'t match'
}

/**
 * Shows the first validation message for a control once the form is submitted.
 * <cs-field-error [control]="form.controls.email" [submitted]="isSubmitted" [messages]="{ pattern: 'Enter a valid email' }" />
 * Reads control.errors on each check, so it relies on the parent re-rendering after submit.
 */
@Component({
  selector: 'cs-field-error',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @let message = error();
    @if (message) {
      <p class="mt-1 text-sm text-danger" role="alert">{{ message }}</p>
    }
  `
})
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>(null)
  readonly submitted = input(false)
  readonly messages = input<Record<string, string>>({})

  protected error (): string | null {
    const errors = this.control()?.errors
    if (!this.submitted() || errors === null || errors === undefined) return null
    const key = Object.keys(errors)[0]
    return this.mergedMessages()[key] ?? 'This value is not valid'
  }

  private readonly mergedMessages = computed(() => ({ ...defaultMessages, ...this.messages() }))
}
