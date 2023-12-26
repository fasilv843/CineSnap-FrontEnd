/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminTheatersComponent } from './admin-theaters/admin-theaters.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';
import { AdminMoviesComponent } from './admin-movies/admin-movies.component';
import { AdminCsMoviesComponent } from './admin-cs-movies/admin-cs-movies.component';
import { AdminMoviesSearchComponent } from './admin-movies-search/admin-movies-search.component';
import { AdminMoviesExploreComponent } from './admin-movies-explore/admin-movies-explore.component';
import { ValidationModule } from 'src/app/modules/validation/validation.module';
import { FilterComponent } from '../common/filter/filter.component';
import { SearchComponent } from '../common/search/search.component';
import { TableFilterComponent } from '../common/table-filter/table-filter.component';
import { AdminTicketsComponent } from './admin-tickets/admin-tickets.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminLoginComponent,
    AdminNavComponent,
    AdminTheatersComponent,
    AdminUsersComponent,
    AdminMessagesComponent,
    AdminMoviesComponent,
    AdminCsMoviesComponent,
    AdminMoviesSearchComponent,
    AdminMoviesExploreComponent,
    AdminTicketsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    FilterComponent,
    SearchComponent,
    TableFilterComponent
  ]
})
export class AdminModule { }
