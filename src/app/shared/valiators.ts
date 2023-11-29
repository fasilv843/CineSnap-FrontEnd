import { Validators } from '@angular/forms'
import { userNameMinLength, userNameMaxLength, nameRegex, emailRegex, OTPRegex, passwordMinLength, passwordRegex, ZipRegex, MAX_COLS, charRegex, numRegex, MAX_TICKET_PRICE, MIN_COLS, MIN_TICKET_PRICE, screenNameMinLength, screenNameMaxLength, screenNameRegex, mobileRegex } from './constants'
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

export const requiredValidator = [Validators.required]

// export const validateDOB: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   const dob = control.get('dob')
//   if (dob == null) return null

//   const selectedDate = dob.value
//   console.log(selectedDate, 'selectedDate from validateDOB')

//   const today = new Date()
//   const minAgeDate = new Date(today.getFullYear() - MinAge, today.getMonth(), today.getDate())

//   if (selectedDate > minAgeDate) {
//     dob.setErrors({ minAge: true })
//     return { minAge: true }
//   } else if (selectedDate < MinDate) {
//     dob.setErrors({ minDate: true })
//     return { minDate: true }
//   }

//   return null
// }
