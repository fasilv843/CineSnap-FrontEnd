import { createAction, props } from '@ngrx/store'
import { type IUserRes } from 'src/app/models/users'

export const fetchUserData = createAction('[User] Fetch User Data From Database', props<{ userId: string }>())
export const saveUserOnStore = createAction('[User] Save User Data On Store', props<{ userDetails: IUserRes }>())
export const deleteUserFromStore = createAction('[User] Delete User Data From Store')
