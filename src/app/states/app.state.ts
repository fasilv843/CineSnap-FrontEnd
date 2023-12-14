/* eslint-disable @typescript-eslint/consistent-type-imports */
// app.state.ts
import * as fromUser from './user/user.reducer'
import * as fromTheater from './theater/theater.reducer'
import * as fromCoords from './coords/coords.reducer'

export interface RootState {
  user: fromUser.UserState
  theater: fromTheater.TheaterState
  coords: fromCoords.ICoordState
}

export const reducers = {
  user: fromUser.userReducer,
  theater: fromTheater.theaterReducer,
  coords: fromCoords.coordsReducer
}
