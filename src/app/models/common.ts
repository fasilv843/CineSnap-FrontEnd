import { type IAvailCatsOnScreen } from '../services/screen.service'
import { type IRevenueData } from './charts'
import { type IUsersListForChats, type IChatRes } from './chat'
import { type ICouponRes } from './coupon'
import { type ICSMovieRes } from './movie'
import { type IScreenSeatRes, type IScreenSeat } from './screenSeat'
import { type IScreen } from './screens'
import { type IShowRes, type IShowsOnAScreen, type IShow } from './show'
import { type IShowSeatsRes } from './showSeat'
import { type ITheatersAndCount, type ITheaterRes } from './theater'
import { type Seats, type ITicketRes, type ITempTicketRes, type ITicketsAndCount, type IHoldedSeat } from './ticket'
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

export interface IWalletHistoryAndCount {
  walletHistory: IWalletHistory[]
  count: number
}

export interface ICoords {
  type?: string
  coordinates: [number, number]
}

export type AllResTypes = ITheaterRes | ITheaterRes[] | IScreenSeat | IScreenSeatRes | IAvailCatsOnScreen
| IUserRes | IUserRes[] | IShowRes | IShowsOnAScreen[] | ITheatersAndCount | IUsersListForChats[] | ICouponRes | ICouponRes[]
| IShow | IChatRes | ITicketRes | ITicketRes[] | ICSMovieRes | IUsersAndCount | ITicketsAndCount | IHoldedSeat[] | IRevenueData
| ICSMovieRes[] | IScreen | IScreen[] | Seats | ITempTicketRes | ITempTicketRes[] | null | IShowSeatsRes | IWalletHistoryAndCount

export type SuccessTypes = Exclude<AllResTypes, null>

export interface IApiRes<T extends AllResTypes> {
  status: number
  message: string
  data: T
}

export interface IRazorpayRes {
  razorpay_payment_id: string
}

export type RowType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U'
export type ColNumType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
