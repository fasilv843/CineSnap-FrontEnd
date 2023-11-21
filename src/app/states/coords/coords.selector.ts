import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type ICoordState } from './coords.reducer'

export const selectCoordsState = createFeatureSelector<ICoordState>('coords')
export const selectCoords = createSelector(
  selectCoordsState,
  (state) => state.coords
)
