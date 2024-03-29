/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheaterRoutingModule } from './theater-routing.module';
import { ThrNavComponent } from './thr-nav/thr-nav.component';
import { ThrLoginComponent } from './thr-login/thr-login.component';
import { ThrRegisterComponent } from './thr-register/thr-register.component';
import { ThrHomeComponent } from './thr-home/thr-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThrShowsComponent } from './thr-shows/thr-shows.component';
import { ThrScreensComponent } from './thr-screens/thr-screens.component';
import { ThrMessagesComponent } from './thr-messages/thr-messages.component';
import { ThrMoviesComponent } from './thr-movies/thr-movies.component';
import { ThrProfileComponent } from './thr-profile/thr-profile.component';
import { StoreModule } from '@ngrx/store';
import { theaterReducer } from 'src/app/states/theater/theater.reducer';
import { EditTheaterProfileComponent } from './edit-theater-profile/edit-theater-profile.component';
import { ThrSeatingComponent } from './thr-seating/thr-seating.component';
import { FilterComponent } from '../common/filter/filter.component';
import { DateComponent } from '../common/date/date.component';
import { ApprovalPendingComponent } from './approval-pending/approval-pending.component';
import { ApprovalRejectedComponent } from './approval-rejected/approval-rejected.component';
import { SearchComponent } from '../common/search/search.component';
import { CsMoviesComponent } from '../common/cs-movies/cs-movies.component';
import { SpinnerComponent } from '../common/spinner/spinner.component';
import { ThrTicketsComponent } from './thr-tickets/thr-tickets.component';
import { TableFilterComponent } from '../common/table-filter/table-filter.component';
import { ThrWalletComponent } from './thr-wallet/thr-wallet.component';
import { WalletHistoryComponent } from '../common/wallet-history/wallet-history.component';
import { ThrCouponComponent } from './thr-coupon/thr-coupon.component';
import { LineGraphComponent } from '../common/line-graph/line-graph.component';
import { CityValidationComponent } from '../common/validation/city-validation/city-validation.component';
import { OtpValidationComponent } from '../common/validation/otp-validation/otp-validation.component';
import { CountryValidationComponent } from '../common/validation/country-validation/country-validation.component';
import { StateValidationComponent } from '../common/validation/state-validation/state-validation.component';
import { DistrictValidationComponent } from '../common/validation/district-validation/district-validation.component';
import { ZipValidationComponent } from '../common/validation/zip-validation/zip-validation.component';
import { PasswordValidationComponent } from '../common/validation/password-validation/password-validation.component';
import { RepeatPassValidationComponent } from '../common/validation/repeat-pass-validation/repeat-pass-validation.component';
import { MobileValidationComponent } from '../common/validation/mobile-validation/mobile-validation.component';
import { EmailValidationComponent } from '../common/validation/email-validation/email-validation.component';
import { NameValidationComponent } from '../common/validation/name-validation/name-validation.component';
import { ProfileDpComponent } from '../common/profile-dp/profile-dp.component';

@NgModule({
  declarations: [
    ThrLoginComponent,
    ThrRegisterComponent,
    ThrHomeComponent,
    ThrNavComponent,
    ThrShowsComponent,
    ThrScreensComponent,
    ThrMessagesComponent,
    ThrMoviesComponent,
    ThrSeatingComponent,
    ThrProfileComponent,
    EditTheaterProfileComponent,
    ApprovalPendingComponent,
    ApprovalRejectedComponent,
    ThrTicketsComponent,
    ThrWalletComponent,
    ThrCouponComponent
  ],
  imports: [
    CommonModule,
    TheaterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('theater', theaterReducer),
    FilterComponent,
    DateComponent,
    SearchComponent,
    CsMoviesComponent,
    SpinnerComponent,
    TableFilterComponent,
    WalletHistoryComponent,
    LineGraphComponent,
    ProfileDpComponent,

    // Validation Components
    NameValidationComponent,
    MobileValidationComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent,
    OtpValidationComponent,
    CountryValidationComponent,
    StateValidationComponent,
    DistrictValidationComponent,
    CityValidationComponent,
    ZipValidationComponent
  ]
})
export class TheaterModule { }
