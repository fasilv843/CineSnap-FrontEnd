import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type userState } from './user.reducer'

export const selectUserState = createFeatureSelector<userState>('user')
export const selectUserDetails = createSelector(
  selectUserState,
  (state: userState) => state.userDetails
)
