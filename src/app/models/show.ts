import { type ICSMovieRes } from './movie'

export interface IShowSeat {
  col: number
  isBooked: boolean
}

export interface IShow {
  _id: string
  movieId: string
  screenId: string
  startTime: Date
  endTime: Date
  ticketPrice: number
  totalSeatCount: number
  availableSeatCount: number
  seatId: string
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seatId'> {
  diamondPrice: number
  goldPrice?: number
  silverPrice?: number
}

export interface IShowRes {
  movieId: ICSMovieRes
  shows: IShow[]
}

export interface IApiShowsRes {
  status: number
  message: string
  data: IShowsOnAScreen[] | null
}

export interface IApiShowRes {
  status: number
  message: string
  data: IShow | null
}

export interface IShowsOnAScreen {
  screenId: string
  screenName: string
  shows: IShowRes[]
}
