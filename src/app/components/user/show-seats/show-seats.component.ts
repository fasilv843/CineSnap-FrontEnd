import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type ICSMovieRes } from 'src/app/models/movie'
import { type IShow, type IShowSeat } from 'src/app/models/show'
import { type IShowSeatCategoryRes, type IShowSeatsRes } from 'src/app/models/showSeat'
import { type ITicketSeat, type ISelectedSeat, type ITicketReqs } from 'src/app/models/ticket'
import { ShowSeatService } from 'src/app/services/show-seat.service'
import { ShowService } from 'src/app/services/show.service'
import { TicketService } from 'src/app/services/ticket.service'
import { ChargePerDiamondTicket, ChargePerGoldTicket, ChargePerSilverTicket } from 'src/app/shared/constants'
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
  showId = ''
  rows: string[] = []
  showSeatId: string = ''
  show!: IShowWithMovie
  seats!: IShowSeatsRes
  selectedSeats: ISelectedSeat[] = []
  holdedSeats: ISelectedSeat[] = []

  diamond!: IShowSeatCategoryRes
  gold!: IShowSeatCategoryRes
  silver!: IShowSeatCategoryRes

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(ShowService) private readonly showService: ShowService,
    @Inject(TicketService) private readonly ticketService: TicketService,
    @Inject(ShowSeatService) private readonly showSeatService: ShowSeatService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.showSeatId = params['seatId']
    })

    this.route.queryParamMap.subscribe(params => {
      this.theaterId = params.get('theaterId') as string
      this.showId = params.get('showId') as string
      // console.log('queryMap working')
    })

    // console.warn(this.theaterId, this.showId, 'theaterId, showId')

    this.showSeatService.getShowSeatDetails(this.showSeatId).subscribe({
      next: (res) => {
        if (res.data === null) return
        this.seats = res.data
        this.diamond = res.data.diamond
        this.gold = res.data.gold
        this.silver = res.data.silver
        console.log(this.seats, 'seats from get show seats')
      }
    })

    this.showService.getShowDetails(this.showId).subscribe({
      next: (res) => {
        console.log(res.data, 'show data from getShowDetails')
        if (res.data !== null) {
          this.show = res.data as unknown as IShowWithMovie
          // console.log(res.data, 'log seats')
          // console.log(typeof res.data.seats, 'type of seats')
          // console.dir(res.data.seats, 'dir seats')
          // this.rows = Array.from(Object.keys(res.data.seats))
        }
      }
    })

    this.ticketService.getHoldedSeats(this.showId).subscribe({
      next: (res) => {
        console.warn(res, 'res from holded seats')
        if (res.data === null) return
        res.data.forEach(tkt => {
          console.log(tkt, 'tkt from forEach holded seat')
          if (tkt.diamondSeats !== undefined) {
            const holded = tkt.diamondSeats.seats.map(seat => ({ row: seat[0], col: parseInt(seat.slice(1)) }))
            console.log(holded, 'holded from diamond')
            this.holdedSeats = [...holded, ...this.holdedSeats]
          }

          if (tkt.goldSeats !== undefined) {
            const holded = tkt.goldSeats.seats.map(seat => ({ row: seat[0], col: parseInt(seat.slice(1)) }))
            console.log(holded, 'holded from gold')
            this.holdedSeats = [...holded, ...this.holdedSeats]
          }

          if (tkt.silverSeats !== undefined) {
            const holded = tkt.silverSeats.seats.map(seat => ({ row: seat[0], col: parseInt(seat.slice(1)) }))
            console.log(holded, 'holded from silver')
            this.holdedSeats = [...holded, ...this.holdedSeats]
          }
        })

        console.log(this.holdedSeats, 'holded seats')
      }
    })
  }

  getSeatDefaultValue (cat: IShowSeatCategoryRes, CSCharge: number): ITicketSeat {
    return {
      seats: [],
      name: cat.name,
      singlePrice: cat.price,
      CSFeePerTicket: CSCharge,
      totalPrice: 0
    }
  }

  bookTicket (): void {
    this.userDetails$.subscribe((user) => {
      if (user != null) this.userId = user._id
    })

    const diamondKeys = this.getRowKeys(this.diamond)
    const goldKeys = this.getRowKeys(this.gold)
    const silverKeys = this.getRowKeys(this.silver)

    const diamondSeats = this.getSeatDefaultValue(this.diamond, ChargePerDiamondTicket)
    const goldSeats = this.getSeatDefaultValue(this.gold, ChargePerGoldTicket)
    const silverSeats = this.getSeatDefaultValue(this.silver, ChargePerSilverTicket)

    this.selectedSeats.forEach(seat => {
      if (diamondKeys.includes(seat.row)) {
        diamondSeats.seats.push(seat.row + seat.col)
      } else if (goldKeys.includes(seat.row)) {
        goldSeats.seats.push(seat.row + seat.col)
      } else if (silverKeys.includes(seat.row)) {
        silverSeats.seats.push(seat.row + seat.col)
      }
    })

    diamondSeats.totalPrice = (diamondSeats.singlePrice + diamondSeats.CSFeePerTicket) * diamondSeats.seats.length
    goldSeats.totalPrice = (goldSeats.singlePrice + goldSeats.CSFeePerTicket) * goldSeats.seats.length
    silverSeats.totalPrice = (silverSeats.singlePrice + silverSeats.CSFeePerTicket) * silverSeats.seats.length

    const totalPrice = diamondSeats.totalPrice + goldSeats.totalPrice + silverSeats.totalPrice

    const ticketReqs: ITicketReqs = {
      showId: this.showId,
      screenId: this.show.screenId,
      movieId: this.show.movieId._id,
      theaterId: this.theaterId,
      userId: this.userId,
      totalPrice,
      seatCount: this.selectedSeats.length,
      startTime: this.show.startTime,
      endTime: this.show.endTime
    }

    if (diamondSeats.seats.length > 0) ticketReqs.diamondSeats = diamondSeats
    if (goldSeats.seats.length > 0) ticketReqs.goldSeats = goldSeats
    if (silverSeats.seats.length > 0) ticketReqs.silverSeats = silverSeats

    // console.warn('booking ticket', ticketReqs)
    this.ticketService.bookTicket(ticketReqs).subscribe({
      next: (res) => {
        if (res.data != null) {
          // console.log(res.data, 'res from bookTicket')
          void this.router.navigate(['/user/show/book', res.data._id])
        }
      }
    })
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

  selectSeat (row: string, column: IShowSeat): void {
    if (!column.isBooked && !this.isHolded(row, column.col)) {
      const col = column.col
      if (this.isSeatSelected(row, col)) {
        this.selectedSeats = this.selectedSeats.filter(seat => !(seat.row === row && seat.col === col))
      } else {
        if (this.selectedSeats.length < 10) {
          this.selectedSeats.push({ row, col })
        }
      }
    }
  }

  getRowKeys (category: IShowSeatCategoryRes): string[] {
    return Object.keys(category.seats)
  }
}
