import { type IApiRes, type ColNumType } from './common'

export interface IScreenSeatCategory {
  name: string
  seats: Map<string, ColNumType[]>
}

export interface IScreenSeatCategoryRes extends Omit<IScreenSeatCategory, 'seats'> {
  seats: Partial<Record<string, ColNumType[]>>
}

export interface IScreenSeat {
  _id: string
  diamond: IScreenSeatCategory
  gold: IScreenSeatCategory
  silver: IScreenSeatCategory
}

export interface IScreenSeatRes {
  _id: string
  diamond: IScreenSeatCategoryRes
  gold: IScreenSeatCategoryRes
  silver: IScreenSeatCategoryRes
}
export interface IApiScreenSeatRes extends IApiRes<IScreenSeatRes | null> {}
