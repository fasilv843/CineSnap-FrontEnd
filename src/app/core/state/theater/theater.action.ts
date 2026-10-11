import { createAction, props } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/core/models/theater.model'

export const saveTheaterOnStore = createAction('[Theater] Save Theater Data On Store', props<{ theaterDetails: ITheaterRes }>())
export const deleteTheaterFromStore = createAction('[Theater] Delete Theater Data On Store')
