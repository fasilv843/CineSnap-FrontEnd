import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type IShow, type IShowSeat } from 'src/app/models/show'
import { type ITicketReqs } from 'src/app/models/ticket'
import { ShowService } from 'src/app/services/show.service'
import { TicketService } from 'src/app/services/ticket.service'
import { selectUserDetails } from 'src/app/states/user/user.selector'

@Component({
  selector: 'app-show-seats',
  templateUrl: './show-seats.component.html',
  styleUrls: ['./show-seats.component.css']
})
export class ShowSeatsComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  userId = ''
  theaterId = ''
  rows: string[] = []
  // cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  showId: string = ''
  show!: IShow
  selectedSeats: Array<{ row: string, col: number }> = []

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(ShowService) private readonly showService: ShowService,
    @Inject(TicketService) private readonly ticketService: TicketService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.theaterId = params['theaterId']
      this.showId = params['showId']
    })

    this.showService.getShowDetails(this.showId).subscribe({
      next: (res) => {
        console.log(res.data, 'show data from getShowDetails')
        if (res.data !== null) {
          this.show = res.data
          console.log(res.data.seats, 'log seats')
          console.log(typeof res.data.seats, 'type of seats')
          console.dir(res.data.seats, 'dir seats')
          this.rows = Array.from(Object.keys(res.data.seats))
        }
      }
    })
  }

  getSeatMap (seats: Array<{ row: string, col: number }>): Map<string, number[]> {
    const seatsMap = new Map<string, number[]>()
    for (const seat of seats) {
      seatsMap.set(seat.row, (seatsMap.get(seat.row) ?? []).concat(seat.col))
    }
    return seatsMap
  }

  bookTicket (): void {
    this.userDetails$.subscribe((user) => {
      if (user != null) this.userId = user._id
    })

    const seats = this.getSeatMap(this.selectedSeats)

    const ticketReqs: ITicketReqs = {
      showId: this.showId,
      screenId: this.show.screenId,
      movieId: this.show.movieId,
      theaterId: this.theaterId,
      userId: this.userId,
      singlePrice: this.show.ticketPrice,
      totalPrice: this.show.ticketPrice * this.selectedSeats.length,
      seatCount: this.selectedSeats.length,
      startTime: this.show.startTime,
      endTime: this.show.endTime,
      seats
    }
    this.ticketService.bookTicket(ticketReqs).subscribe({
      next: (res) => {
        void this.router.navigate(['/user/show/book'])
      }
    }) // Save on a temporary storage and redirect to next page
  }

  getColumnFirstHalf (row: string): IShowSeat[] {
    return this.show.seats[row].slice(0, this.show.seats[row].length / 2)
  }

  getColumnSecondHalf (row: string): IShowSeat[] {
    return this.show.seats[row].slice(this.show.seats[row].length / 2)
  }

  isSeatSelected (row: string, col: number): boolean {
    for (const seat of this.selectedSeats) {
      if (seat.row === row && seat.col === col) return true
    }
    return false
  }

  selectSeat (row: string, col: number): void {
    if (this.isSeatSelected(row, col)) {
      this.selectedSeats = this.selectedSeats.filter(seat => !(seat.row === row && seat.col === col))
    } else {
      if (this.selectedSeats.length < 10) {
        this.selectedSeats.push({ row, col })
      }
    }
  }
}
