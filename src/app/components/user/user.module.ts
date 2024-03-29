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
import { localStorageSync as ngrxLocalStorageSync } from 'ngrx-store-localstorage';

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
import { CityValidationComponent } from '../common/validation/city-validation/city-validation.component';
import { CountryValidationComponent } from '../common/validation/country-validation/country-validation.component';
import { DistrictValidationComponent } from '../common/validation/district-validation/district-validation.component';
import { EmailValidationComponent } from '../common/validation/email-validation/email-validation.component';
import { MobileValidationComponent } from '../common/validation/mobile-validation/mobile-validation.component';
import { NameValidationComponent } from '../common/validation/name-validation/name-validation.component';
import { OtpValidationComponent } from '../common/validation/otp-validation/otp-validation.component';
import { PasswordValidationComponent } from '../common/validation/password-validation/password-validation.component';
import { RepeatPassValidationComponent } from '../common/validation/repeat-pass-validation/repeat-pass-validation.component';
import { StateValidationComponent } from '../common/validation/state-validation/state-validation.component';
import { ZipValidationComponent } from '../common/validation/zip-validation/zip-validation.component';
import { DobValidationComponent } from '../common/validation/dob-validation/dob-validation.component';
import { ProfileDpComponent } from '../common/profile-dp/profile-dp.component';
import { CarouselComponent } from './user-home/carousel/carousel.component';

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
    FilterComponent,
    DateComponent,
    SpinnerComponent,
    SearchComponent,
    CsMoviesComponent,
    WalletHistoryComponent,
    ScrollHTabsComponent,
    ProfileDpComponent,
    CarouselComponent,

    NameValidationComponent,
    MobileValidationComponent,
    EmailValidationComponent,
    DobValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent,
    OtpValidationComponent,
    CountryValidationComponent,
    StateValidationComponent,
    DistrictValidationComponent,
    CityValidationComponent,
    ZipValidationComponent
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
