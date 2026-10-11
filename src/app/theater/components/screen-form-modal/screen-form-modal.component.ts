import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { validateByTrimming } from 'src/app/shared/utils/custom-validators'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { MAX_COLS, MIN_COLS, screenNameMaxLength, screenNameMinLength } from 'src/app/core/constants/constants'
import { colValidators, rowValidators, screenNameValidators } from 'src/app/shared/utils/form-validators'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

export interface ScreenFormResult { name: string, rows: string, cols: number }

/** Adds a screen: its name, the last row letter and seats per row. Closes with a ScreenFormResult. */
@Component({
  selector: 'app-screen-form-modal',
  imports: [ReactiveFormsModule, ButtonDirective, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card mx-auto w-[min(30rem,calc(100vw-2rem))] p-6 shadow-raised" role="dialog" aria-labelledby="screen-form-title">
      <h2 id="screen-form-title" class="text-xl font-semibold">Add a screen</h2>
      <p class="mt-1 text-sm text-muted">You'll lay out the seats on the next page.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="mt-5 space-y-4">
        <div>
          <label for="screen-name" class="mb-1.5 block text-sm font-semibold">Screen name</label>
          <input id="screen-name" class="input" formControlName="name" placeholder="Audi 1" autocomplete="off" />
          <cs-field-error [control]="form.controls.name" [submitted]="submitted()" [messages]="messages.name" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="rows" class="mb-1.5 block text-sm font-semibold">Last row</label>
            <input id="rows" class="input uppercase" formControlName="rows" maxlength="1" placeholder="J" autocomplete="off" aria-describedby="rows-hint" />
            <p id="rows-hint" class="mt-1 text-xs text-subtle">Rows run from A to this letter</p>
            <cs-field-error [control]="form.controls.rows" [submitted]="submitted()" [messages]="messages.rows" />
          </div>
          <div>
            <label for="cols" class="mb-1.5 block text-sm font-semibold">Seats per row</label>
            <input id="cols" class="input" formControlName="cols" inputmode="numeric" placeholder="20" autocomplete="off" />
            <cs-field-error [control]="form.controls.cols" [submitted]="submitted()" [messages]="messages.cols" />
          </div>
        </div>
        @if (seatCount(); as count) {
          <p class="rounded-control bg-muted px-3 py-2 text-sm" aria-live="polite">That's up to <strong>{{ count }} seats</strong>.</p>
        }
        <div class="flex justify-end gap-2 border-t border-default pt-5">
          <button csButton variant="ghost" type="button" (click)="modal.dismiss('cancel')">Cancel</button>
          <button csButton type="submit">Add and lay out seats</button>
        </div>
      </form>
    </div>
  `
})
export class ScreenFormModalComponent {
  protected readonly modal = inject(ActiveModal)

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [validateByTrimming(screenNameValidators)] }),
    rows: new FormControl('', { nonNullable: true, validators: [validateByTrimming(rowValidators)] }),
    cols: new FormControl('', { nonNullable: true, validators: [validateByTrimming(colValidators)] })
  })

  protected readonly submitted = signal(false)
  protected readonly messages = {
    name: {
      required: 'Name the screen',
      minlength: `Use at least ${screenNameMinLength} characters`,
      maxlength: `Use at most ${screenNameMaxLength} characters`,
      pattern: 'Use letters, numbers and spaces'
    },
    rows: { required: 'Enter the last row letter', pattern: 'Use one capital letter, A to Z' },
    cols: { required: 'Enter seats per row', pattern: 'Use a whole number', min: `At least ${MIN_COLS}`, max: `At most ${MAX_COLS}` }
  }

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() })
  protected readonly seatCount = computed(() => {
    const { rows, cols } = this.value()
    const letter = (rows ?? '').toUpperCase()
    const perRow = Number(cols)
    if (!/^[A-Z]$/.test(letter) || !Number.isInteger(perRow) || perRow < MIN_COLS || perRow > MAX_COLS) return null
    return (letter.charCodeAt(0) - 64) * perRow
  })

  constructor () {
    // Row letters are capitals; accept lowercase typing
    this.form.controls.rows.valueChanges.subscribe(value => {
      if (value !== value.toUpperCase()) this.form.controls.rows.setValue(value.toUpperCase(), { emitEvent: false })
    })
  }

  protected submit (): void {
    this.submitted.set(true)
    if (this.form.invalid) return
    const { name, rows, cols } = this.form.getRawValue()
    this.modal.close({ name: name.trim(), rows: rows.trim(), cols: Number(cols) } satisfies ScreenFormResult)
  }
}
