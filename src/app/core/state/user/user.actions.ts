import { createAction, props } from '@ngrx/store'
import { type IUserRes } from 'src/app/core/models/user.model'

export const saveUserOnStore = createAction('[User] Save User Data On Store', props<{ userDetails: IUserRes }>())
export const deleteUserFromStore = createAction('[User] Delete User Data From Store')
/** Moves the stored wallet balance by `by` rupees, mirroring a debit or refund the backend just made */
export const adjustUserWallet = createAction('[User] Adjust Wallet', props<{ by: number }>())
