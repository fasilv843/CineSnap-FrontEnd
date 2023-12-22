import { FormBuilder, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms'
import { MinAge, MinDate } from '../shared/constants'

// Create a shared FormBuilder instance
const formBuilder = new FormBuilder()

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')
  const repeatPassword = control.get('repeatPassword')

  console.log(repeatPassword, 'repeat password from password match validator')

  if ((password != null) && (repeatPassword != null)) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (repeatPassword.value === '') {
      repeatPassword.setErrors({ required: true })
      return { required: true }
    }
    if (password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }
  }
  repeatPassword?.setErrors(null)
  return null
}

export function validateByTrimming (validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl) => {
    console.log(control.value, 'control.value in trimming')
    const trimmedValue = control.value.trim()

    // Create a new control with the trimmed value
    const trimmedControl = formBuilder.control(trimmedValue)

    // Apply the provided validators to the trimmed value
    return validators.reduce<ValidationErrors | null>((error: ValidationErrors | null, validator) => error ?? validator(trimmedControl), null)
  }
}

export const validateDOB: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dob = control.get('dob')
  if (dob == null) return null

  const selectedDate = new Date(dob.value)
  console.log(dob, 'dob from validateDOB')
  console.log(selectedDate, 'selectedDate from validateDOB')

  const today = new Date()
  const minAgeDate = new Date(today.getFullYear() - MinAge, today.getMonth(), today.getDate())

  if (selectedDate > minAgeDate) {
    dob.setErrors({ minAge: true })
    return { minAge: true }
  } else if (selectedDate < MinDate) {
    dob.setErrors({ minDate: true })
    return { minDate: true }
  }

  return null
}
