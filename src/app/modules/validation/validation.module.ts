import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NameValidationComponent } from 'src/app/components/validation/name-validation/name-validation.component'
import { EmailValidationComponent } from 'src/app/components/validation/email-validation/email-validation.component'
import { PasswordValidationComponent } from 'src/app/components/validation/password-validation/password-validation.component'
import { RepeatPassValidationComponent } from 'src/app/components/validation/repeat-pass-validation/repeat-pass-validation.component'

@NgModule({
  declarations: [
    NameValidationComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NameValidationComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    RepeatPassValidationComponent
  ]
})
export class ValidationModule { }
