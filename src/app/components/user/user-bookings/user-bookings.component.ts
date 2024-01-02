import { Component, Inject, type OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { getLanguage } from 'src/app/helpers/movie'
import { type ITicketRes } from 'src/app/models/ticket'
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
  // seats: string[] = []
  now = new Date()
  fourHoursBefore!: Date // new Date(this.now.getTime() - 4 * 60 * 60 * 1000)

  getLanguage = getLanguage

  constructor (
    @Inject(TicketService) private readonly ticketService: TicketService,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe((user) => {
      if (user !== null) this.userId = user._id
    })

    // this.ticketService.getTicketsOfUser(this.userId).subscribe({
    //   next: (res) => {
    //     console.log(res.data, 'user tickets data')
    //     this.tickets = res.data
    //     console.log(new Date(this.tickets[0].startTime), this.fourHoursBefore, new Date(this.tickets[0].startTime) > this.fourHoursBefore)
    //   }
    // })
  }

  getFourHourBeforeTime (date: Date): Date {
    date = new Date(date)
    date.setHours(date.getHours() - 4)
    return date
  }

  getDate (date: Date): Date {
    return new Date(date)
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

  // seatMapToStringArr (seatsObj: Map<string, number[]>): string[] {
  //   const seats: string[] = []
  //   Object.entries(seatsObj).forEach(([row, cols]: [string, number[]]) => {
  //     cols.forEach(col => {
  //       seats.push(row + col)
  //     })
  //   })
  //   return seats
  // }
}
