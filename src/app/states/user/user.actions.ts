import { createAction, props } from '@ngrx/store'
import { type IUserRes } from 'src/app/models/users'

export const saveUserOnStore = createAction('[User] Save User Data On Store', props<{ userDetails: IUserRes }>())
