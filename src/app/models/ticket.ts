import { type IApiRes } from './common'
import { type ICSMovieRes } from './movie'
import { type IScreen } from './screens'
import { type IShowRes } from './show'
import { type ITheaterRes } from './theater'

export interface ISelectedSeat {
  row: string
  col: number
}

export interface ITicket {
  _id: string
  showId: string
  userId: string
  screenId: string
  movieId: string
  theaterId: string
  singlePrice: number
  totalPrice: number
  seatCount: number
  seats: Map<string, number[]>
  startTime: Date
  endTime: Date
  isCancelled: boolean
  // status: string
}

export interface ITempTicket extends Omit<ITicket, 'isCancelled'> {
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

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'seats'> {
  seats: ISelectedSeat[]
}
export interface ITicketRes extends Omit<ITicket, 'showId' | 'screenId' | 'movieId' | 'theaterId'> {
  showId: IShowRes
  screenId: IScreen
  movieId: ICSMovieRes
  theaterId: ITheaterRes
}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[]> {}

export type Seats = Array<Map<string, number[]>>
export interface IApiSeatsRes extends IApiRes<Seats | null> {}
