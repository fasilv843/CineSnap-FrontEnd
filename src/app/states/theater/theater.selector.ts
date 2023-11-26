import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type theaterState } from './theater.reducer'

export const selectTheaterState = createFeatureSelector<theaterState>('theater')
export const selectTheaterDetails = createSelector(
  selectTheaterState,
  (state: theaterState) => state.theaterDetails
)
