import { type IApiRes } from './common'

export interface IScreen {
  _id: string
  theaterId: string
  name: string
  defaultPrice: number
  row: string
  col: number
  seatsCount: number
  seats: Map<string, number[]>
}

export interface IScreenRequirements
  extends Omit<IScreen, '_id' | 'seatsCount' | 'seats'> {
  row: string
  col: number
}

export interface IApiScreenRes extends IApiRes<IScreen> {}
export interface IApiScreensRes extends IApiRes<IScreen[]> {}

// export interface IApiScreenRes {
//   status: number
//   message: string
//   data: IScreen | null
// }

// export interface IApiScreensRes {
//   status: number
//   message: string
//   data: IScreen [] | []
// }
