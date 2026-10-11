import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'
import { DatePipe } from '@angular/common'
import { createColumnHelper, injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table'
import { STATUS_LABEL, STATUS_TONE, type TicketRow, cancelledLabel } from 'src/app/helpers/ticket-row'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { type UrlPaging } from 'src/app/shared/ui/url-paging'

// The server pages tickets, so the table only needs pagination state
const features = tableFeatures({ rowPaginationFeature })
const column = createColumnHelper<typeof features, TicketRow>()
const allColumns = column.columns([
  column.accessor('movie', { header: 'Movie' }),
  column.accessor('theater', { header: 'Theater' }),
  column.accessor('start', { header: 'Show' }),
  column.accessor('customer', { header: 'Customer' }),
  column.accessor('seats', { header: 'Seats' }),
  column.accessor('amount', { header: 'Amount' }),
  column.accessor('status', { header: 'Status' }),
  column.display({ id: 'actions', header: 'Actions' })
])

/** Server-paged ticket list for the theater and admin areas, with a cancel action on upcoming tickets. */
@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ButtonDirective, PaginationComponent, StatePanelComponent]
})
export class TicketTableComponent {
  readonly rows = input.required<TicketRow[]>()
  readonly total = input.required<number>()
  readonly paging = input.required<UrlPaging>()
  readonly loading = input(false)
  readonly failed = input(false)
  /** Admin sees which theater each ticket is for */
  readonly showTheater = input(false)
  /** Id of the ticket being cancelled, to disable its button */
  readonly cancelling = input<string | null>(null)
  readonly emptyMessage = input('Tickets show up here as soon as they are booked.')

  readonly cancel = output<TicketRow>()
  readonly retried = output()

  private readonly columns = computed(() => this.showTheater() ? allColumns : allColumns.filter(c => c.id !== 'theater'))

  protected readonly table = injectTable(() => ({
    features,
    columns: this.columns(),
    data: this.rows(),
    getRowId: row => row.id,
    manualPagination: true,
    rowCount: this.total(),
    state: { pagination: { pageIndex: this.paging().page() - 1, pageSize: this.paging().limit() } }
  }))

  protected readonly statusLabel = STATUS_LABEL
  protected readonly statusTone = STATUS_TONE
  protected readonly cancelledLabel = cancelledLabel
}
