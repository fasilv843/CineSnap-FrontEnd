import { Validators } from '@angular/forms'
import { userNameMinLength, userNameMaxLength, nameRegex, emailRegex, OTPRegex, passwordMinLength, passwordRegex, ZipRegex } from './constants'

export const nameValidators = [
  Validators.required,
  Validators.minLength(userNameMinLength),
  Validators.maxLength(userNameMaxLength),
  Validators.pattern(nameRegex)
]

export const emailValidators = [
  Validators.required,
  Validators.pattern(emailRegex)
]

export const passwordValidators = [
  Validators.required,
  Validators.minLength(passwordMinLength),
  Validators.pattern(passwordRegex)
]

export const otpValidators = [
  Validators.required,
  Validators.pattern(OTPRegex)
]

export const zipValidators = [
  Validators.required,
  Validators.pattern(ZipRegex)
]

export const requiredValidator = [Validators.required]
