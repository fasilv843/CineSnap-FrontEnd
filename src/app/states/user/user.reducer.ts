import { createReducer, on } from '@ngrx/store'
import { type IUserRes } from 'src/app/models/users'
import { deleteUserFromStore, saveUserOnStore } from './user.actions'

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
  })
)
