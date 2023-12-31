import { type IApiRes, type ICoords, type ITheaterAddress, type IWalletHistory } from './common'

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
  walletHistory: IWalletHistory[] | []
  coords: ICoords
  address: ITheaterAddress
  approvalStatus: 'Approved' | 'Pending' | 'Rejected'
}

export interface ITheaterUpdate extends Omit<ITheaterRes, '_id' | 'email' | 'isBlocked' | 'wallet' | 'walletHistory' | 'liscenceId' | 'approvalStatus'> {}

export interface ITheaterAuth {
  name: string
  email: string
  liscenceId: string
  coords: ICoords
  address: ITheaterAddress
}

export interface IApiTheaterRes extends IApiRes<ITheaterRes> {}
export interface IApiTheatersRes extends IApiRes<ITheaterRes[]> {}

export interface IApiTheaterAuthRes {
  status: number
  message: string
  data: ITheaterRes | null
  accessToken: string
  refreshToken: string
}

export interface ITheatersAndCount {
  theaters: ITheaterRes[]
  theaterCount: number
}
