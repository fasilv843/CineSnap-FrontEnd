import { type IApiRes } from './api.model'

export interface IScreen {
  _id: string
  theaterId: string
  name: string
  rows: string
  cols: number
  seatsCount: number
  seatId: string
}

export interface IAvailCatsOnScreen {
  diamond: string | undefined
  gold: string | undefined
  silver: string | undefined
}

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seatId'> { }
export interface IApiScreenRes extends IApiRes<IScreen | null> { }
export interface IApiScreensRes extends IApiRes<IScreen[] | null> { }
