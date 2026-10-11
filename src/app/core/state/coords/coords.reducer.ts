import { createReducer, on } from '@ngrx/store'
import { saveCoords } from './coords.actions'
import { type ICoords } from 'src/app/models/common'

export interface ICoordState {
  coords: ICoords | null
}

export const initialCoordState: ICoordState = {
  coords: null
}

export const coordsReducer = createReducer(
  initialCoordState,
  on(saveCoords, (state, { coords }) => {
    return { ...state, coords }
  })
)
