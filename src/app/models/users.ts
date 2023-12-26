import { type IWalletHistory, type ICoords, type IUserAddress, type IApiRes } from './common'

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
export interface IApiUserRes extends IApiRes<IUserRes> {}
export interface IApiUsersRes extends IApiRes<IUserRes[]> {}

export interface IUserUpdate extends Omit<IUserRes, '_id' | 'email' | 'password' | 'isBlocked' | 'wallet' | 'walletHistory'> { }

export interface IUsersAndCount {
  users: IUserRes[]
  userCount: number
}
