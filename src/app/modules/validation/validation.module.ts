import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NameValidationComponent } from 'src/app/components/validation/name-validation/name-validation.component'
import { EmailValidationComponent } from 'src/app/components/validation/email-validation/email-validation.component'
import { PasswordValidationComponent } from 'src/app/components/validation/password-validation/password-validation.component'
import { RepeatPassValidationComponent } from 'src/app/components/validation/repeat-pass-validation/repeat-pass-validation.component'
import { OtpValidationComponent } from 'src/app/components/validation/otp-validation/otp-validation.component'
import { ColValidationComponent } from 'src/app/components/validation/col-validation/col-validation.component'
import { DefPriceValidationComponent } from 'src/app/components/validation/def-price-validation/def-price-validation.component'
import { RowValidationComponent } from 'src/app/components/validation/row-validation/row-validation.component'

@NgModule({
  declarations: [
    NameValidationComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent,
    OtpValidationComponent,
    RowValidationComponent,
    ColValidationComponent,
    DefPriceValidationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NameValidationComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent,
    OtpValidationComponent,
    RowValidationComponent,
    ColValidationComponent,
    DefPriceValidationComponent
  ]
})
export class ValidationModule { }
