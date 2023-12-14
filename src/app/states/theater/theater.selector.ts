import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type TheaterState } from './theater.reducer'

export const selectTheaterState = createFeatureSelector<TheaterState>('theater')
export const selectTheaterDetails = createSelector(
  selectTheaterState,
  (state: TheaterState) => state.theaterDetails
)
