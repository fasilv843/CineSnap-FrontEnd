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
  seats: Map<string, IShowSeat[]>
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seats'> {}

export interface IShowRes extends IShow {}

export interface IApiShowsRes {
  status: number
  message: string
  data: IShowRes[]
}

export interface IApiShowRes {
  status: number
  message: string
  data: IShowRes | null
}
