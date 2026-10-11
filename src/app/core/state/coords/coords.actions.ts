import { createAction, props } from '@ngrx/store'
import { type ICoords } from 'src/app/core/models/api.model'

export const saveCoords = createAction('[Location] Save Curr Coordinates On Store', props<{ coords: ICoords }>())
