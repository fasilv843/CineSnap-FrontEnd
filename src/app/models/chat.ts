import { type IApiRes } from './common'

export interface IChatMessage {
  sender: 'User' | 'Theater' | 'Admin' // User, Theater, or Admin _id
  message: string
  time: Date
}

export interface IChatHistory {
  userId?: string // User _id
  theaterId?: string // Theater _id
  adminId?: string // Admin _id
  messages: IChatMessage[]
}

export interface IChatReqs extends Omit<IChatHistory, 'messages'>, Omit<IChatMessage, 'time'> {}
export interface IChatRes extends IChatHistory { }
export interface IApiChatRes extends IApiRes<IChatRes | null> { }
