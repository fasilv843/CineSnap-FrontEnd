import { type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms'

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')
  const repeatPassword = control.get('repeatPassword')

  if ((password != null) && (repeatPassword != null) && password.value !== repeatPassword.value) {
    repeatPassword.setErrors({ passwordMismatch: true })
    return { passwordMismatch: true }
  }
  repeatPassword?.setErrors(null)
  return null
}
