import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'
import { DatePipe } from '@angular/common'
import { dateToString } from 'src/app/shared/utils/date'

export interface PickerDay { key: string, date: Date, label: string | null }

/** The next `count` days, today first, keyed YYYY-MM-DD (local time) */
export function upcomingDays (count: number): PickerDay[] {
  return Array.from({ length: count }, (_, i) => {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() + i)
    return { key: dateToString(day), date: day, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : null }
  })
}

/**
 * Row of day buttons (scrolls sideways on phones). The parent keeps the selected key, usually in ?date=.
 * [allowOther]="true" adds a date field for days beyond the row.
 */
@Component({
  selector: 'cs-day-picker',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="day-strip" role="group" aria-label="Choose a day">
      @for (day of days(); track day.key) {
        <button type="button" class="day" [attr.aria-pressed]="day.key === selected()" (click)="selectedChange.emit(day.key)">
          <span class="text-xs font-semibold">{{ day.label ?? (day.date | date: 'EEE') }}</span>
          <span class="font-display text-2xl font-extrabold leading-none">{{ day.date | date: 'd' }}</span>
          <span class="text-xs">{{ day.date | date: 'MMM' }}</span>
        </button>
      }
      @if (allowOther()) {
        <label class="day other" [attr.data-active]="otherSelected()">
          <span class="text-xs font-semibold">Other date</span>
          <input type="date" class="w-full bg-transparent text-center text-xs" [min]="days()[0].key" [value]="otherSelected() ? selected() : ''"
            (change)="pickOther($event)" aria-label="Pick another date" />
        </label>
      }
    </div>
  `,
  styles: `
    .day-strip {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      scrollbar-width: none;
      margin-inline: -1rem;
      padding: 0.25rem 1rem;
    }

    .day {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.125rem;
      width: 4.5rem;
      padding: 0.625rem 0.5rem;
      border: 1px solid var(--border-color-default);
      border-radius: var(--radius-card);
      background-color: var(--background-color-surface);
      color: var(--text-color-muted);
      transition: border-color 150ms ease;
      cursor: pointer;
    }

    .day:hover {
      border-color: var(--color-primary);
    }

    .day[aria-pressed='true'],
    .day[data-active='true'] {
      border-color: var(--color-primary);
      background-color: var(--color-primary);
      color: var(--color-primary-foreground);
    }

    .other {
      width: 8rem;
    }

    .other input {
      color: inherit;
      color-scheme: inherit;
    }
  `
})
export class DayPickerComponent {
  readonly count = input(7)
  readonly selected = input.required<string>()
  readonly allowOther = input(false)
  readonly selectedChange = output<string>()

  protected readonly days = computed(() => upcomingDays(this.count()))
  protected readonly otherSelected = computed(() => !this.days().some(day => day.key === this.selected()))

  protected pickOther (event: Event): void {
    const value = (event.target as HTMLInputElement).value
    if (value !== '') this.selectedChange.emit(value)
  }
}
