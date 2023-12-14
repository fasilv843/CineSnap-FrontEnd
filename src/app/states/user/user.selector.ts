import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type UserState } from './user.reducer'

export const selectUserState = createFeatureSelector<UserState>('user')
export const selectUserDetails = createSelector(
  selectUserState,
  (state: UserState) => state.userDetails
)
