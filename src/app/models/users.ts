import { type IWalletHistory, type ICoords, type IUserAddress } from './common'

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

// interface to respond to front end
export interface IUserRes {
  _id: string
  name: string
  email: string
  password?: string
  mobile?: number
  dob: Date
  isBlocked: boolean
  profilePic?: string
  wallet: number
  coords?: ICoords
  address?: IUserAddress
  walletHistory: IWalletHistory[] | []
}

// api response for single user as data
export interface IApiUserRes {
  status: number
  message: string
  data: IUserRes | null
  token: string
}

export interface IApiUserAuthRes {
  status: number
  message: string
  data: IUserRes | null
  accessToken: string
  refreshToken: string
}

export interface IApiTokenRes {
  status: number
  message: string
  accessToken: string
}

// api response for multiple users as data
export interface IApiUsersRes {
  status: number
  message: string
  data: IUserRes[] | []
  token: string
}

export interface IUserUpdate extends Omit<IUserRes, '_id' | 'email' | 'password' | 'isBlocked' | 'wallet' | 'walletHistory'> { }
