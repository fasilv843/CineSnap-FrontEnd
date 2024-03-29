/* eslint-disable @typescript-eslint/semi */
import { NgModule, isDevMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { TransformUrlInterceptor } from './interceptors/transform-url.interceptor'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule, type MetaReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { hydrationMetaReducer } from './states/hydration.reducer'
import { reducers } from './states/app.state';

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TransformUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// {
//   id: FacebookLoginProvider.PROVIDER_ID,
//   provider: new FacebookLoginProvider('clientId')
// }
