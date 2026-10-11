import { DestroyRef, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { SocialAuthService, type SocialUser } from '@abacritt/angularx-social-login'
import { EMPTY, catchError, filter, switchMap } from 'rxjs'
import { type IApiUserAuthRes, type IUserSocialAuth } from 'src/app/core/models/user.model'
import { saveUserOnStore } from 'src/app/core/state/user/user.actions'

/**
 * Signs the user in once the backend has issued tokens: stores them, puts the user in the store and opens home.
 * Call in an injection context (a component field or constructor).
 */
export function injectStartSession (): (res: IApiUserAuthRes) => void {
  const store = inject(Store)
  const router = inject(Router)
  return (res) => {
    localStorage.setItem('userAccessToken', res.accessToken)
    localStorage.setItem('userRefreshToken', res.refreshToken)
    localStorage.removeItem('userAuthToken') // temporary token used only during sign-up OTP
    if (res.data !== null) store.dispatch(saveUserOnStore({ userDetails: res.data }))
    void router.navigate(['/user/home'])
  }
}

/**
 * Completes Google sign-in: when the Google button reports a signed-in account, exchange it for CineSnap tokens.
 * Works for both new and existing accounts. Call in an injection context; stops when the component is destroyed.
 */
export function connectGoogleSignIn (onError: () => void = () => {}): void {
  const http = inject(HttpClient)
  const startSession = injectStartSession()
  inject(SocialAuthService).authState.pipe(
    filter((user): user is SocialUser & { name: string, email: string } => user?.email !== undefined && user.name !== undefined),
    switchMap(user => http.post<IApiUserAuthRes>('user/auth/google', {
      name: user.name,
      email: user.email,
      profilePic: user.photoUrl
    } satisfies IUserSocialAuth).pipe(
      // A failed exchange must not end the stream, so the user can try the Google button again
      catchError(() => { onError(); return EMPTY })
    )),
    takeUntilDestroyed(inject(DestroyRef))
  ).subscribe(startSession)
}
