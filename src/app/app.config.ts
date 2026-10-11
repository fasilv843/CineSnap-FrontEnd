import { type ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'

import { routes } from './app.routes'
import { jwtInterceptor } from './interceptors/jwt.interceptor'
import { transformUrlInterceptor } from './interceptors/transform-url.interceptor'
import { errorHandlerInterceptor } from './interceptors/error-handler.interceptor'
import { hydrationMetaReducer } from './states/hydration.reducer'
import { reducers } from './states/app.state'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withXhr(),
      withInterceptors([jwtInterceptor, transformUrlInterceptor, errorHandlerInterceptor])
    ),
    provideStore(reducers, { metaReducers: [hydrationMetaReducer] }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
}
