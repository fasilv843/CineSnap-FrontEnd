import { createReducer, on } from '@ngrx/store'
import { type IUser } from 'src/app/models/users'
import { saveUserOnStore } from './user.actions'

export interface userState {
  userDetails: IUser | null
}

export const initialUserState: userState = {
  userDetails: null
}

export const userReducer = createReducer(
  initialUserState,
  on(saveUserOnStore, (state, { userDetails }) => {
    return { ...state, userDetails }
  })
)
