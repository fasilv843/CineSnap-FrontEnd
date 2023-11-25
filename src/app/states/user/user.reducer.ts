import { createReducer, on } from '@ngrx/store'
import { type IUserRes } from 'src/app/models/users'
import { saveUserOnStore } from './user.actions'

export interface userState {
  userDetails: IUserRes | null
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
