import { type IWalletHistory, type ICoords, type IUserAddress } from './common'

// export interface IUser {
//   _id: string
//   name: string
//   email: string
//   password: string
//   mobile?: number
//   dob?: Date
//   isBlocked: boolean
//   profilePic: string
//   wallet?: number | null
//   location?: ILocation
//   address?: IUserAddress
// }

export interface IUserRes {
  _id: string
  name: string
  email: string
  mobile?: number
  dob: Date
  isBlocked: boolean
  profilePic?: string
  wallet: number
  coords?: ICoords
  address?: IUserAddress
  walletHistory: IWalletHistory[] | []
}

export interface IUserSocialAuth {
  name: string
  email: string
  profilePic?: string
}

export interface IUserAuth {
  name: string
  email: string
  password: string
}

export interface IApiUserRes {
  status: number
  message: string
  data: IUserRes
  token: string
}

export interface IApiUsersRes {
  status: number
  message: string
  data: IUserRes[]
  token: string
}
