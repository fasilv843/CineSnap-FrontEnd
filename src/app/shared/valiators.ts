import { Validators } from '@angular/forms'
import { userNameMinLength, userNameMaxLength, nameRegex, emailRegex, OTPRegex, passwordMinLength, passwordRegex, ZipRegex, MAX_COLS, charRegex, numRegex, MAX_TICKET_PRICE, MIN_COLS, MIN_TICKET_PRICE } from './constants'

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

export const rowValidators = [
  Validators.required,
  Validators.pattern(charRegex)
]

export const colValidators = [
  Validators.required,
  Validators.pattern(numRegex),
  Validators.min(MIN_COLS),
  Validators.max(MAX_COLS)
]

export const defaultPriceValidators = [
  Validators.required,
  Validators.pattern(numRegex),
  Validators.min(MIN_TICKET_PRICE),
  Validators.max(MAX_TICKET_PRICE)
]

export const requiredValidator = [Validators.required]
