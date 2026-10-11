import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { toMovieCard } from 'src/app/shared/utils/movie-card'
import { type ITicketView } from 'src/app/core/models/ticket.model'
import { UserTicketRepo } from 'src/app/user/repos/ticket.repo'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/core/toast/toast.service'
import { selectUserDetails } from 'src/app/core/state/user/user.selector'
import { UserNavComponent } from '../../layout/user-nav/user-nav.component'
import { valueOf } from 'src/app/shared/utils/resource'

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, DatePipe, ButtonDirective, IconComponent, StatePanelComponent]
})
export class UserBookingSuccessComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly ticketRepo = inject(UserTicketRepo)
  private readonly toast = inject(ToastService)

  protected readonly user = inject(Store).selectSignal(selectUserDetails)
  private readonly params = toSignal(this.route.paramMap, { requireSync: true })
  protected readonly ticketId = computed(() => this.params().get('ticketId') ?? '')

  protected readonly ticket = rxResource({
    params: () => this.ticketId(),
    stream: ({ params }) => this.ticketRepo.getTicketData(params).pipe(map(res => res.data as ITicketView | null))
  })

  protected readonly movie = computed(() => {
    const movie = valueOf(this.ticket)?.movieId
    return movie != null ? toMovieCard(movie) : null
  })

  protected readonly seats = computed(() => {
    const ticket = valueOf(this.ticket)
    if (ticket == null) return []
    return [ticket.diamondSeats, ticket.goldSeats, ticket.silverSeats].flatMap(line => line?.seats ?? []).sort()
  })

  protected readonly directions = computed(() => {
    const coords = valueOf(this.ticket)?.theaterId?.coords
    return coords != null ? `https://www.google.com/maps/dir/?api=1&destination=${coords.coordinates[1]},${coords.coordinates[0]}` : null
  })

  protected readonly sendingInvoice = signal(false)

  protected emailInvoice (): void {
    this.sendingInvoice.set(true)
    this.ticketRepo.sendInvoiceRequest(this.ticketId()).subscribe({
      next: () => {
        this.sendingInvoice.set(false)
        this.toast.success('Invoice sent', `Check ${this.user()?.email ?? 'your email'} in a minute.`)
      },
      error: () => { this.sendingInvoice.set(false) }
    })
  }
}
