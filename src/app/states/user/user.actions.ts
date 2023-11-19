import { createAction, props } from '@ngrx/store'
import { type IUser } from 'src/app/models/users'

export const saveUserOnStore = createAction('[User] Save User Data On Store', props<{ userDetails: IUser }>())
