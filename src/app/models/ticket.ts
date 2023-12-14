import { type IApiRes } from './common'

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

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'seats'> {
  seats: ISelectedSeat[]
}
export interface ITicketRes extends ITicket {}
export interface IApiTicketRes extends IApiRes<ITicketRes> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[]> {}

export type Seats = Array<Map<string, number[]>>
export interface IApiSeatsRes extends IApiRes<Seats | null> {}
