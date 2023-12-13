import { type IChatRes } from './chat'
import { type IShowRes, type IShowsOnAScreen, type IShow } from './show'

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

export type AllResTypes = IShowRes | IShowsOnAScreen[] | IShow | IChatRes | null
export type SuccessTypes = Exclude<AllResTypes, null>

export interface IApiRes<T extends AllResTypes> {
  status: number
  message: string
  data: T
}
