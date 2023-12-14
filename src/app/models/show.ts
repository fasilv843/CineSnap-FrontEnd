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
  seats: Record<string, IShowSeat[]>
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seats'> {}

export interface IShowRes {
  movieId: ICSMovieRes
  shows: Array<Omit<IShow, 'seats'>>
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
