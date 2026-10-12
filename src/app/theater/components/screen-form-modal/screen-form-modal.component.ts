import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { FormField, form, maxLength, validate } from '@angular/forms/signals'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { MAX_COLS, MIN_COLS, numRegex, screenNameMaxLength, screenNameMinLength, screenNameRegex } from 'src/app/core/constants/constants'
import { checkText, textRules } from 'src/app/shared/utils/form-rules'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

export interface ScreenFormResult { name: string, rows: string, cols: number }

/** Adds a screen: its name, the last row letter and seats per row. Closes with a ScreenFormResult. */
@Component({
  selector: 'app-screen-form-modal',
  imports: [FormField, ButtonDirective, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card mx-auto w-[min(30rem,calc(100vw-2rem))] p-6 shadow-raised" role="dialog" aria-labelledby="screen-form-title">
      <h2 id="screen-form-title" class="text-xl font-semibold">Add a screen</h2>
      <p class="mt-1 text-sm text-muted">You'll lay out the seats on the next page.</p>

      <form (submit)="$event.preventDefault(); submit()" novalidate class="mt-5 space-y-4">
        <div>
          <label for="screen-name" class="mb-1.5 block text-sm font-semibold">Screen name</label>
          <input id="screen-name" class="input" [formField]="form.name" placeholder="Audi 1" autocomplete="off" />
          <cs-field-error [field]="form.name" [submitted]="submitted()" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="rows" class="mb-1.5 block text-sm font-semibold">Last row</label>
            <input id="rows" class="input uppercase" [formField]="form.rows" placeholder="J" autocomplete="off" aria-describedby="rows-hint" />
            <p id="rows-hint" class="mt-1 text-xs text-subtle">Rows run from A to this letter</p>
            <cs-field-error [field]="form.rows" [submitted]="submitted()" />
          </div>
          <div>
            <label for="cols" class="mb-1.5 block text-sm font-semibold">Seats per row</label>
            <input id="cols" class="input" [formField]="form.cols" inputmode="numeric" placeholder="20" autocomplete="off" />
            <cs-field-error [field]="form.cols" [submitted]="submitted()" />
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

  private readonly model = signal({ name: '', rows: '', cols: '' })
  protected readonly form = form(this.model, p => {
    textRules(p.name, {
      required: 'Name the screen',
      minLength: [screenNameMinLength, `Use at least ${screenNameMinLength} characters`],
      maxLength: [screenNameMaxLength, `Use at most ${screenNameMaxLength} characters`],
      pattern: [screenNameRegex, 'Use letters, numbers and spaces']
    })
    // Row letters are capitals; lowercase typing is accepted and shown uppercase
    validate(p.rows, ({ value }) => checkText(value().trim().toUpperCase(), {
      required: 'Enter the last row letter',
      pattern: [/^[A-Z]$/, 'Use one capital letter, A to Z']
    }))
    maxLength(p.rows, 1)
    textRules(p.cols, {
      required: 'Enter seats per row',
      pattern: [numRegex, 'Use a whole number'],
      min: [MIN_COLS, `At least ${MIN_COLS}`],
      max: [MAX_COLS, `At most ${MAX_COLS}`]
    })
  })

  protected readonly submitted = signal(false)

  protected readonly seatCount = computed(() => {
    const { rows, cols } = this.model()
    const letter = rows.trim().toUpperCase()
    const perRow = Number(cols)
    if (!/^[A-Z]$/.test(letter) || !Number.isInteger(perRow) || perRow < MIN_COLS || perRow > MAX_COLS) return null
    return (letter.charCodeAt(0) - 64) * perRow
  })

  protected submit (): void {
    this.submitted.set(true)
    if (this.form().invalid()) return
    const { name, rows, cols } = this.model()
    this.modal.close({ name: name.trim(), rows: rows.trim().toUpperCase(), cols: Number(cols) } satisfies ScreenFormResult)
  }
}
