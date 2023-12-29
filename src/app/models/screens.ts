import { type IApiRes } from './common'

export interface IScreen {
  _id: string
  theaterId: string
  name: string
  row: string
  col: number
  seatsCount: number
  seats: Map<string, number[]>
}

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seats'> {}
export interface IApiScreenRes extends IApiRes<IScreen> {}
export interface IApiScreensRes extends IApiRes<IScreen[]> {}
