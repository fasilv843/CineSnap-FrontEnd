import { Validators } from '@angular/forms'
import { userNameMinLength, userNameMaxLength, nameRegex, emailRegex, OTPRegex, passwordMinLength, passwordRegex, ZipRegex, MAX_COLS, charRegex, numRegex, MAX_TICKET_PRICE, MIN_COLS, MIN_TICKET_PRICE, screenNameMinLength, screenNameMaxLength, screenNameRegex, mobileRegex, MAX_WALLET_ADD, MIN_WALLET_ADD } from './constants'
import { validateDOB } from '../helpers/validations'

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

export const screenNameValidators = [
  Validators.required,
  Validators.minLength(screenNameMinLength),
  Validators.maxLength(screenNameMaxLength),
  Validators.pattern(screenNameRegex)
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

export const mobileValidators = [
  Validators.pattern(mobileRegex)
]

export const dobValidators = [
  validateDOB
]

export const walletAmountValidators = [
  Validators.required,
  Validators.pattern(numRegex),
  Validators.min(MIN_WALLET_ADD),
  Validators.max(MAX_WALLET_ADD)
]

// Coupon Validators

export const codeValidators = [
  Validators.required,
  Validators.pattern('^[A-Z0-9]{3,15}$')
]

export const descriptionValidators = [
  Validators.required,
  Validators.minLength(10),
  Validators.maxLength(100)
]

export const startDateValidators = [
  Validators.required
]

export const endDateValidators = [
  Validators.required
]

export const discountValidators = [
  Validators.required,
  Validators.min(1),
  Validators.max(1000),
  Validators.pattern(numRegex)

]

export const minTicketCountValidators = [
  Validators.min(0),
  Validators.max(10),
  Validators.pattern(numRegex)
]

export const couponTypeValidators = [
  Validators.required
]

export const discountTypeValidators = [
  Validators.required
]

export const maxDiscountAmtValidators = [
  Validators.min(0),
  Validators.max(5000),
  Validators.pattern(numRegex)
]

export const couponCountValidators = [
  Validators.min(0),
  Validators.pattern(numRegex)
]

export const requiredValidator = [Validators.required]
