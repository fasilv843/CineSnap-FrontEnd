import { type UserService } from 'src/app/services/user.service'
import { Injectable } from '@angular/core'
import { type Actions, createEffect, ofType } from '@ngrx/effects'
import { fetchUserData, saveUserOnStore } from './user.actions'
import { map, switchMap } from 'rxjs'

@Injectable()
export class UserEffects {
  constructor (
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {}

  fetchUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchUserData),
      switchMap((action: { userId: string }) => {
        console.log(action, 'action from user effects fetch user data')
        return this.userService.getUserDetails(action.userId).pipe(
          map(userRes => saveUserOnStore({ userDetails: userRes.data }))
        )
      })
    )
  })
}
