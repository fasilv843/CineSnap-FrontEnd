import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { type AbstractControl, type ValidationErrors } from '@angular/forms'
import { map, of, startWith, switchMap } from 'rxjs'

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
 * <cs-field-error [control]="form.controls.email" [submitted]="submitted()" [messages]="{ pattern: 'Enter a valid email' }" />
 * Follows the control through its events stream, so it updates without zone.js or a parent re-render.
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
  readonly control = input<AbstractControl | null>(null)
  readonly submitted = input(false)
  readonly messages = input<Record<string, string>>({})

  // Every value, status or setErrors() change on the control (including cross-field validators) re-reads its errors
  private readonly errors = toSignal(toObservable(this.control).pipe(
    switchMap(control => control === null
      ? of<ValidationErrors | null>(null)
      : control.events.pipe(startWith(null), map(() => control.errors)))
  ), { initialValue: null })

  private readonly mergedMessages = computed(() => ({ ...defaultMessages, ...this.messages() }))

  protected readonly message = computed(() => {
    const errors = this.errors()
    if (!this.submitted() || errors === null) return null
    const key = Object.keys(errors)[0]
    return key === undefined ? null : this.mergedMessages()[key] ?? 'This value is not valid'
  })
}
