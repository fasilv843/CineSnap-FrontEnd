/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserNavComponent } from './user-nav/user-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMoviesComponent } from './user-movies/user-movies.component';
import { UserTheatersComponent } from './user-theaters/user-theaters.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { userReducer } from 'src/app/states/user/user.reducer';
import { SocialLoginModule, GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { environments } from 'src/environments/environment';
import { coordsReducer } from 'src/app/states/coords/coords.reducer';
import { ValidationModule } from 'src/app/modules/validation/validation.module';
import { localStorageSync as ngrxLocalStorageSync } from 'ngrx-store-localstorage';

import { ImageModule } from 'src/app/modules/image/image.module';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { TheaterPageComponent } from './theater-page/theater-page.component';
import { FilterComponent } from '../common/filter/filter.component';
import { DateComponent } from '../common/date/date.component';
import { UserMessageComponent } from './user-message/user-message.component';
import { ShowSeatsComponent } from './show-seats/show-seats.component';
import { BookingComponent } from './booking/booking.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { SeatStatusDirective } from 'src/app/directives/seat-status.directive';
import { SpinnerComponent } from '../common/spinner/spinner.component';
import { SearchComponent } from '../common/search/search.component';
import { CsMoviesComponent } from '../common/cs-movies/cs-movies.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { WalletHistoryComponent } from '../common/wallet-history/wallet-history.component';
import { ScrollHTabsComponent } from '../common/scroll-h-tabs/scroll-h-tabs.component';

export function localStorageSyncReducer (reducer: ActionReducer<any>): ActionReducer<any> {
  return ngrxLocalStorageSync({ keys: ['user'], rehydrate: true })(reducer);
}

@NgModule({
  declarations: [
    UserRegisterComponent,
    UserLoginComponent,
    UserHomeComponent,
    UserNavComponent,
    UserMoviesComponent,
    UserTheatersComponent,
    UserProfileComponent,
    EditUserProfileComponent,
    UserBookingsComponent,
    TheaterPageComponent,
    UserMessageComponent,
    ShowSeatsComponent,
    BookingComponent,
    BookingSuccessComponent,
    SeatStatusDirective,
    UserWalletComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('user', userReducer),
    StoreModule.forFeature('coords', coordsReducer),
    SocialLoginModule,
    ValidationModule,
    ImageModule,
    FilterComponent,
    DateComponent,
    SpinnerComponent,
    SearchComponent,
    CsMoviesComponent,
    WalletHistoryComponent,
    ScrollHTabsComponent
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environments.google_client_id)
          }
        ]
      } // as SocialAuthServiceConfig,
    }
  ]
})
export class UserModule { }
