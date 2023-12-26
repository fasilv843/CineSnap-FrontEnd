import { type IChatRes } from './chat'
import { type ICSMovieRes } from './movie'
import { type IScreen } from './screens'
import { type IShowRes, type IShowsOnAScreen, type IShow } from './show'
import { type ITheatersAndCount, type ITheaterRes } from './theater'
import { type Seats, type ITicketRes, type ITempTicketRes } from './ticket'
import { type IUsersAndCount, type IUserRes } from './users'

export type Location = [number, number]

export interface IUserAddress {
  country: string
  state: string
  district: string
  city: string
  zip: number
}

export interface ITheaterAddress extends IUserAddress {
  landmark?: string
}

export interface IWalletHistory {
  amount: number
  message: string
  date: Date
}

export interface ICoords {
  type?: string
  coordinates: [number, number]
}

export type AllResTypes = ITheaterRes | ITheaterRes[]
| IUserRes | IUserRes[] | IShowRes | IShowsOnAScreen[] | ITheatersAndCount
| IShow | IChatRes | ITicketRes | ITicketRes[] | ICSMovieRes | IUsersAndCount
| ICSMovieRes[] | IScreen | IScreen[] | Seats | ITempTicketRes | ITempTicketRes[] | null

export type SuccessTypes = Exclude<AllResTypes, null>

export interface IApiRes<T extends AllResTypes> {
  status: number
  message: string
  data: T
}

export interface IRazorpayRes {
  razorpay_payment_id: string
}
