import { Component, Inject, type OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { getLanguage } from 'src/app/helpers/movie'
import { type ITicketSeat, type ITicketRes } from 'src/app/models/ticket'
import { InvoiceService } from 'src/app/services/invoice.service'
import { TicketService } from 'src/app/services/ticket.service'
import { selectUserDetails } from 'src/app/states/user/user.selector'

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  userId = ''
  tickets: ITicketRes[] = []
  now = new Date()
  invoiceTicket!: ITicketRes

  getLanguage = getLanguage

  constructor (
    @Inject(TicketService) private readonly ticketService: TicketService,
    @Inject(Store) private readonly store: Store,
    @Inject(InvoiceService) private readonly invoiceService: InvoiceService
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe((user) => {
      if (user !== null) this.userId = user._id
    })

    this.ticketService.getTicketsOfUser(this.userId).subscribe({
      next: (res) => {
        console.log(res.data, 'user tickets data')
        this.tickets = res.data
      }
    })
  }

  getFourHourBeforeTime (date: Date): Date {
    date = new Date(date)
    date.setHours(date.getHours() - 4)
    return date
  }

  getDate (date: Date): Date {
    return new Date(date)
  }

  downloadInvoice (ticket: ITicketRes): void {
    this.invoiceTicket = ticket
    void this.invoiceService.generateInvoice(this.invoiceTicket).then((imageUrl) => {
      console.log('Generated Image URL:', imageUrl)
      this.invoiceService.downloadInvoice(imageUrl)
    })
  }

  cancelTicket (ticketId: string): void {
    this.ticketService.cancelTicket(ticketId).subscribe({
      next: () => {
        const ticketIdx = this.tickets.findIndex(tkt => ticketId === tkt._id)
        this.tickets = [
          ...this.tickets.slice(0, ticketIdx),
          { ...this.tickets[ticketIdx], isCancelled: true, cancelledBy: 'User' },
          ...this.tickets.slice(ticketIdx + 1)
        ]
      }
    })
  }

  getSeatsArr (diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): string[] {
    let seats: string[] = []
    if (diamondSeats !== undefined) {
      seats = [...seats, ...diamondSeats.seats]
    }
    if (goldSeats !== undefined) {
      seats = [...seats, ...goldSeats.seats]
    }
    if (silverSeats !== undefined) {
      seats = [...seats, ...silverSeats.seats]
    }
    return seats.sort()
  }
}
