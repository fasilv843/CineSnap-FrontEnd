import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { map } from 'rxjs'
import { ScreenSeatService } from 'src/app/services/screen-seat.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { valueOf } from 'src/app/helpers/resource'
import {
  CATEGORY_KEYS, MAX_ROWS, type CategoryKey, type Layout,
  addColumn, addRow, fromScreenSeat, numberRow, removeColumn, removeRow, rename, rowLetters, seatCount, toScreenSeat, toggleSeat, totalRows
} from './seat-layout'

@Component({
  selector: 'app-thr-seating',
  templateUrl: './thr-seating.component.html',
  styleUrl: './thr-seating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, IconComponent, PageHeaderComponent, StatePanelComponent]
})
export class ThrSeatingComponent {
  private readonly screenSeatService = inject(ScreenSeatService)
  private readonly toast = inject(ToastService)

  private readonly params = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true })
  protected readonly seatId = computed(() => this.params().get('seatId') ?? '')

  protected readonly saved = rxResource({
    params: () => this.seatId(),
    stream: ({ params }) => this.screenSeatService.getScreenSeatData(params).pipe(map(res => res.data !== null ? fromScreenSeat(res.data) : null))
  })

  /** Working copy; resets whenever a saved layout loads */
  protected readonly layout = linkedSignal<Layout | null>(() => valueOf(this.saved) ?? null)

  protected readonly keys = CATEGORY_KEYS
  protected readonly maxRows = MAX_ROWS
  protected readonly letters = computed(() => { const l = this.layout(); return l !== null ? rowLetters(l) : null })
  protected readonly seats = computed(() => { const l = this.layout(); return l !== null ? seatCount(l) : 0 })
  protected readonly rows = computed(() => { const l = this.layout(); return l !== null ? totalRows(l) : 0 })
  protected readonly dirty = computed(() => JSON.stringify(this.layout()) !== JSON.stringify(valueOf(this.saved) ?? null))
  protected readonly saving = signal(false)

  protected numbers (row: boolean[]): number[] {
    return numberRow(row)
  }

  protected toggle (key: CategoryKey, row: number, col: number): void { this.edit(l => toggleSeat(l, key, row, col)) }
  protected rename (key: CategoryKey, event: Event): void { this.edit(l => rename(l, key, (event.target as HTMLInputElement).value)) }
  protected addRow (key: CategoryKey): void { this.edit(l => addRow(l, key)) }
  protected removeRow (key: CategoryKey): void { this.edit(l => removeRow(l, key)) }
  protected addColumn (key: CategoryKey, at: 'start' | 'end'): void { this.edit(l => addColumn(l, key, at)) }
  protected removeColumn (key: CategoryKey, at: 'start' | 'end'): void { this.edit(l => removeColumn(l, key, at)) }

  protected discard (): void {
    this.layout.set(valueOf(this.saved) ?? null)
  }

  protected save (): void {
    const layout = this.layout()
    if (layout === null || this.saving()) return
    this.saving.set(true)
    this.screenSeatService.updateScreenSeat(toScreenSeat(this.seatId(), layout)).subscribe({
      next: res => {
        this.saving.set(false)
        if (res.data !== null) this.saved.set(fromScreenSeat(res.data))
        this.toast.success('Seat layout saved', 'New shows on this screen use this layout.')
      },
      error: () => { this.saving.set(false) }
    })
  }

  private edit (change: (layout: Layout) => Layout): void {
    this.layout.update(layout => layout !== null ? change(layout) : layout)
  }
}
