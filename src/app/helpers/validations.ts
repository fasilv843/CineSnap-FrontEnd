import { FormBuilder, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms'

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
    const trimmedValue = control.value.trim()

    // Create a new control with the trimmed value
    const trimmedControl = formBuilder.control(trimmedValue)

    // Apply the provided validators to the trimmed value
    return validators.reduce<ValidationErrors | null>((error: ValidationErrors | null, validator) => error ?? validator(trimmedControl), null)
  }
}
