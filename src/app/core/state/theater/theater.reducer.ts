import { createReducer, on } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/models/theater'
import { deleteTheaterFromStore, saveTheaterOnStore } from './theater.action'

export interface TheaterState {
  theaterDetails: ITheaterRes | null
}

export const initialTheaterState: TheaterState = {
  theaterDetails: null
}

export const theaterReducer = createReducer(
  initialTheaterState,
  on(saveTheaterOnStore, (state, { theaterDetails }) => {
    return { ...state, theaterDetails }
  }),
  on(deleteTheaterFromStore, (state) => {
    return { ...state, theaterDetails: null }
  })
)
