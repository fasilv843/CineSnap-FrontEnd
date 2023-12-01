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
import { StoreModule } from '@ngrx/store';
import { userReducer } from 'src/app/states/user/user.reducer';
import { SocialLoginModule, GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { environments } from 'src/environments/environment';
import { coordsReducer } from 'src/app/states/coords/coords.reducer';
import { ValidationModule } from 'src/app/modules/validation/validation.module';

import { ImageModule } from 'src/app/modules/image/image.module';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { TheaterPageComponent } from './theater-page/theater-page.component';

// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// const socialAuthServiceConfig: SocialAuthServiceConfig = {
//   autoLogin: false,
//   providers: [
//     {
//       id: GoogleLoginProvider.PROVIDER_ID,
//       provider: new GoogleLoginProvider(environments.google_client_id)
//     }
//   ],
//   onError: (err: any) => {
//     console.error(err);
//   }
// };

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
    TheaterPageComponent
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
    ImageModule
    // AngularFireModule.initializeApp(environments.firebaseConfig),
    // AngularFirestoreModule,
    // AngularFireStorageModule,
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
