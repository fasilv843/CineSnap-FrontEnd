import { type IApiRes } from './common'

export interface IChatMessage {
  sender: 'User' | 'Theater' | 'Admin'
  message: string
  time: Date
  isRead: boolean
}

export interface IChatMessageRes extends IChatMessage {
  _id: string
}

export interface IChatHistory {
  userId?: string // User _id
  theaterId?: string // Theater _id
  adminId?: string // Admin _id
  messages: IChatMessage[]
}

export interface IChatReqs extends Omit<IChatHistory, 'messages'>, Omit<IChatMessage, 'time' | 'isRead'> {}
export interface IChatRes extends Omit<IChatHistory, 'messages'> {
  messages: IChatMessageRes[]
}
export interface IApiChatRes extends IApiRes<IChatRes | null> { }

export interface IUsersListForChats {
  _id: string
  name: string
  profilePic?: string
  unreadCount: number
}
