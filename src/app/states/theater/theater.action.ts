import { createAction, props } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/models/theater'

export const saveTheaterOnStore = createAction('[Theater] Save Theater Data On Store', props<{ theaterDetails: ITheaterRes }>())
