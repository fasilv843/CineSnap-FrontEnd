import { createReducer, on } from '@ngrx/store'
import { type IUserRes } from 'src/app/models/users'
import { adjustUserWallet, deleteUserFromStore, saveUserOnStore } from './user.actions'

export interface UserState {
  userDetails: IUserRes | null
}

export const initialUserState: UserState = {
  userDetails: null
}

export const userReducer = createReducer(
  initialUserState,
  on(saveUserOnStore, (state, { userDetails }) => {
    return { ...state, userDetails }
  }),
  on(deleteUserFromStore, (state) => {
    return { ...state, userDetails: null }
  }),
  on(adjustUserWallet, (state, { by }) => {
    if (state.userDetails === null) return state
    return { ...state, userDetails: { ...state.userDetails, wallet: Math.max(0, state.userDetails.wallet + by) } }
  })
)
