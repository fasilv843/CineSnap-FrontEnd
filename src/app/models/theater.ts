import { type ICoords, type ITheaterAddress, type IWalletHistory } from './common'

// export interface ITheater {
//   _id: string
//   name: string
//   email: string
//   mobile?: number
//   password: string
//   isBlocked?: boolean
//   profilePic?: string
//   liscenceId: string
//   wallet?: number | null
//   walletHistory?: IWalletHistory[]
//   coords?: ICoords
//   address: ITheaterAddress
// }

export interface ITheaterRes {
  _id: string
  name: string
  email: string
  mobile?: number
  isBlocked: boolean
  profilePic?: string
  liscenceId: string
  wallet: number
  walletHistory?: IWalletHistory[]
  coords: ICoords
  address: ITheaterAddress
}

export interface ITheaterAuth {
  name: string
  email: string
  liscenceId: string
  coords: ICoords
  address: ITheaterAddress
}

export interface IApiTheaterRes {
  status: number
  message: string
  data: ITheaterRes
  token: string
}

export interface IApiTheatersRes {
  status: number
  message: string
  data: ITheaterRes[]
  token: string
}
