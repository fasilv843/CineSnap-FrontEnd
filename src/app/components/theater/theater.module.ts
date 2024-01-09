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
import { ValidationModule } from 'src/app/modules/validation/validation.module';
import { StoreModule } from '@ngrx/store';
import { theaterReducer } from 'src/app/states/theater/theater.reducer';
import { EditTheaterProfileComponent } from './edit-theater-profile/edit-theater-profile.component';
import { ImageModule } from 'src/app/modules/image/image.module';
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
    ThrProfileComponent,
    EditTheaterProfileComponent,
    ThrSeatingComponent,
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
    ValidationModule,
    StoreModule.forFeature('theater', theaterReducer),
    ImageModule,
    FilterComponent,
    DateComponent,
    SearchComponent,
    CsMoviesComponent,
    SpinnerComponent,
    TableFilterComponent,
    WalletHistoryComponent,
    LineGraphComponent
  ]
})
export class TheaterModule { }
