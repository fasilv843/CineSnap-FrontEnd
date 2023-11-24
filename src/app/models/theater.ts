import { type ICoords, type IAddress, type IWalletHistory } from './common'

export interface ITheater {
  _id: string
  name: string
  email: string
  mobile?: number
  password: string
  isBlocked?: boolean
  profilePic?: string
  liscenceId: string
  wallet?: number | null
  walletHistory?: IWalletHistory[]
  coords?: ICoords
  address: IAddress
}

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
  address: IAddress
}
