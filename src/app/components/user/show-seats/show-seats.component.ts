import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type ICSMovieRes } from 'src/app/models/movie'
import { type IShow, type IShowSeat } from 'src/app/models/show'
import { type ISelectedSeat, type ITicketReqs } from 'src/app/models/ticket'
import { ShowService } from 'src/app/services/show.service'
import { TicketService } from 'src/app/services/ticket.service'
import { selectUserDetails } from 'src/app/states/user/user.selector'

interface IShowWithMovie extends Omit<IShow, 'movieId'> {
  movieId: ICSMovieRes
}

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
  showId: string = ''
  show!: IShowWithMovie
  selectedSeats: ISelectedSeat[] = []
  holdedSeats: ISelectedSeat[] = []

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
          this.show = res.data as unknown as IShowWithMovie
          console.log(res.data.seats, 'log seats')
          console.log(typeof res.data.seats, 'type of seats')
          console.dir(res.data.seats, 'dir seats')
          this.rows = Array.from(Object.keys(res.data.seats))
        }
      }
    })

    this.ticketService.getHoldedSeats(this.showId).subscribe({
      next: (res) => {
        console.log(res, 'res from holded seats')
        if (res.data !== null) {
          res.data.forEach(seats => {
            Object.entries(seats).forEach(([key, seatsData]) => {
              console.log(key, 'seat key data from seats')
              console.log(seatsData, typeof seatsData, 'seats data from res')

              Object.entries(seatsData).forEach(([row, cols]: [string, any]) => {
                console.log(row, cols, 'row and cols')

                cols.forEach((col: number) => {
                  const holdedSeat: ISelectedSeat = { row, col }
                  this.holdedSeats.push(holdedSeat)
                })
              })
            })
          })

          console.log(this.holdedSeats, 'holded seats after response')
        }
      }
    })
  }

  bookTicket (): void {
    this.userDetails$.subscribe((user) => {
      if (user != null) this.userId = user._id
    })

    const ticketReqs: ITicketReqs = {
      showId: this.showId,
      screenId: this.show.screenId,
      movieId: this.show.movieId._id,
      theaterId: this.theaterId,
      userId: this.userId,
      singlePrice: this.show.ticketPrice,
      totalPrice: this.show.ticketPrice * this.selectedSeats.length,
      seatCount: this.selectedSeats.length,
      startTime: this.show.startTime,
      endTime: this.show.endTime,
      seats: this.selectedSeats
    }
    console.log('booking ticket', ticketReqs)
    this.ticketService.bookTicket(ticketReqs).subscribe({
      next: (res) => {
        if (res.data != null) {
          console.log(res.data, 'res from bookTicket')
          void this.router.navigate(['/user/show/book', res.data._id])
        } else {
          console.warn('res.data from bookTicket is null')
        }
      }
    })
  }

  getColumnFirstHalf (row: string): IShowSeat[] {
    console.log(this.show.seats[row], 'seats array of show, col, isBooked')
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

  isHolded (row: string, col: number): boolean {
    for (const seat of this.holdedSeats) {
      if (seat.row === row && seat.col === col) return true
    }
    return false
  }

  selectSeat (row: string, col: number): void {
    if (!this.isHolded(row, col)) {
      if (this.isSeatSelected(row, col)) {
        this.selectedSeats = this.selectedSeats.filter(seat => !(seat.row === row && seat.col === col))
      } else {
        if (this.selectedSeats.length < 10) {
          this.selectedSeats.push({ row, col })
        }
      }
    }
  }
}
