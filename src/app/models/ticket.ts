import { type IApiRes } from './common'
import { type ICSMovieRes } from './movie'
import { type IScreen } from './screens'
import { type IShowRes } from './show'
import { type ITheaterRes } from './theater'
import { type IUserRes } from './users'

export interface ISelectedSeat {
  row: string
  col: number
}

export interface ITicketSeat {
  seats: string[]
  readonly name: string
  readonly singlePrice: number
  readonly CSFeePerTicket: number
  totalPrice: number
}

export interface ITicket {
  _id: string
  showId: string
  userId: string
  screenId: string
  movieId: string
  theaterId: string
  diamondSeats?: ITicketSeat
  goldSeats?: ITicketSeat
  silverSeats?: ITicketSeat
  totalPrice: number
  seatCount: number
  startTime: Date
  endTime: Date
  isCancelled: boolean
  cancelledBy?: 'User' | 'Theater' | 'Admin'
  paymentMethod: 'Wallet' | 'Razorpay'
  couponId: string
}

export interface ITempTicket extends Omit<ITicket, 'isCancelled' | 'couponId'> {
  expireAt: Date
}

export interface ITempTicketRes extends Omit<ITempTicket, 'showId' | 'screenId' | 'movieId' | 'theaterId'> {
  showId: IShowRes
  screenId: IScreen
  movieId: ICSMovieRes
  theaterId: ITheaterRes
}

export interface IApiTempTicketRes extends IApiRes<ITempTicketRes | null> {}
export interface IApiTempTicketsRes extends IApiRes<ITempTicketRes[]> {}

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'cancelledBy' | 'paymentMethod' | 'couponId'> {}
export interface ITicketRes extends Omit<ITicket, 'showId' | 'screenId' | 'movieId' | 'theaterId' | 'userId'> {
  showId: IShowRes
  screenId: IScreen
  movieId: ICSMovieRes
  theaterId: ITheaterRes
  userId: IUserRes
}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[]> {}

export type Seats = Array<Map<string, number[]>>

export interface IHoldedSeat {
  diamondSeats?: ITicketSeat
  goldSeats?: ITicketSeat
  silverSeats?: ITicketSeat
}

export interface IApiHoldSeatsRes extends IApiRes<IHoldedSeat[] | null> {}

export interface ITicketsAndCount {
  tickets: ITicketRes[]
  ticketCount: number
}
