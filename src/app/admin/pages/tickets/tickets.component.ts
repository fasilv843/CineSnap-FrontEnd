import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'
import { type TicketRow, toTicketRow } from 'src/app/shared/utils/ticket-row'
import { type ITicketView } from 'src/app/core/models/ticket.model'
import { AdminTicketRepo } from 'src/app/admin/repos/ticket.repo'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { ToastService } from 'src/app/core/toast/toast.service'
import { injectUrlPaging } from 'src/app/shared/ui/url-paging'
import { TicketTableComponent } from '../../../shared/components/ticket-table/ticket-table.component'
import { valueOf } from 'src/app/shared/utils/resource'

@Component({
  selector: 'app-admin-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, TicketTableComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Tickets" description="Every booking across CineSnap, newest first." />
      <app-ticket-table class="mt-6 block" [rows]="rows()" [total]="total()" [paging]="paging" [showTheater]="true"
        [loading]="tickets.isLoading()" [failed]="!!tickets.error()" [cancelling]="cancelling()"
        emptyMessage="Bookings from every theater show up here."
        (cancel)="cancel($event)" (retried)="tickets.reload()" />
    </main>
  `
})
export class AdminTicketsComponent {
  private readonly ticketRepo = inject(AdminTicketRepo)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)

  protected readonly paging = injectUrlPaging()

  protected readonly tickets = rxResource({
    params: () => ({ page: this.paging.page(), limit: this.paging.limit() }),
    stream: ({ params }) => this.ticketRepo.getAllTickets(params.page, params.limit).pipe(
      map(res => ({ rows: (res.data?.tickets ?? []).map(ticket => toTicketRow(ticket as ITicketView)), count: res.data?.ticketCount ?? 0 }))
    )
  })

  // Local copy so a cancellation shows at once
  protected readonly rows = linkedSignal(() => valueOf(this.tickets)?.rows ?? [])
  protected readonly total = computed(() => valueOf(this.tickets)?.count ?? 0)
  protected readonly cancelling = signal<string | null>(null)

  protected async cancel (row: TicketRow): Promise<void> {
    const confirmed = await this.confirm.confirm({
      title: 'Cancel this ticket?',
      message: `${row.customer}'s ${row.seats.length} ${row.seats.length === 1 ? 'seat' : 'seats'} for ${row.movie} at ${row.theater}. They get ₹${row.amount} back in their CineSnap wallet.`,
      confirmLabel: 'Cancel ticket',
      tone: 'danger'
    })
    if (!confirmed) return
    this.cancelling.set(row.id)
    this.ticketRepo.cancelTicketByAdmin(row.id).subscribe({
      next: () => {
        this.cancelling.set(null)
        this.rows.update(rows => rows.map(r => r.id === row.id ? { ...r, status: 'cancelled', cancelledBy: 'Admin' } : r))
        this.toast.success('Ticket cancelled', `${row.customer} has been refunded.`)
      },
      error: () => { this.cancelling.set(null) }
    })
  }
}
