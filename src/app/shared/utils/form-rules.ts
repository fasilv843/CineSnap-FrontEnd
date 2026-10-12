import { type SchemaPath, type ValidationError, maxLength, validate } from '@angular/forms/signals'
import {
  MinAge, MinDate, emailRegex, mobileRegex, nameRegex, OTPRegex, passwordMinLength, passwordRegex,
  userNameMaxLength, userNameMinLength, ZipRegex
} from '../../core/constants/constants'

type Rule<T> = [T, string]

/** Checks on a text field's trimmed value; each carries the message shown when it fails */
export interface TextRules {
  required?: string
  minLength?: Rule<number>
  maxLength?: Rule<number>
  pattern?: Rule<string | RegExp>
  min?: Rule<number>
  max?: Rule<number>
}

/** First failing check, in the order listed in TextRules. An empty optional field passes. */
export function checkText (text: string, rules: TextRules): ValidationError | undefined {
  if (text === '') return rules.required !== undefined ? { kind: 'required', message: rules.required } : undefined
  const { minLength, maxLength, pattern, min, max } = rules
  if (minLength !== undefined && text.length < minLength[0]) return { kind: 'minlength', message: minLength[1] }
  if (maxLength !== undefined && text.length > maxLength[0]) return { kind: 'maxlength', message: maxLength[1] }
  if (pattern !== undefined && !new RegExp(pattern[0]).test(text)) return { kind: 'pattern', message: pattern[1] }
  const number = Number(text)
  if (min !== undefined && !Number.isNaN(number) && number < min[0]) return { kind: 'min', message: min[1] }
  if (max !== undefined && !Number.isNaN(number) && number > max[0]) return { kind: 'max', message: max[1] }
  return undefined
}

/** Validates a text field by its trimmed value, so stray spaces don't fail (or satisfy) a rule */
export function textRules (path: SchemaPath<string>, rules: TextRules): void {
  validate(path, ({ value }) => checkText(value().trim(), rules))
}

export function requiredText (path: SchemaPath<string>, message = 'This field is required'): void {
  textRules(path, { required: message })
}

// Presets ---------------------------------------------------------------------------

export function nameRules (path: SchemaPath<string>, required = 'Enter your name'): void {
  textRules(path, {
    required,
    minLength: [userNameMinLength, `Use at least ${userNameMinLength} letters`],
    maxLength: [userNameMaxLength, `Use at most ${userNameMaxLength} letters`],
    pattern: [nameRegex, 'Use letters and spaces only']
  })
}

export function emailRules (path: SchemaPath<string>, required = 'Enter your email'): void {
  textRules(path, { required, pattern: [emailRegex, 'Enter a valid email address'] })
}

/** A password being chosen, so the strength rules apply */
export function newPasswordRules (path: SchemaPath<string>): void {
  textRules(path, {
    required: 'Choose a password',
    minLength: [passwordMinLength, `Use at least ${passwordMinLength} characters`],
    pattern: [passwordRegex, 'Include an uppercase letter, a lowercase letter and a number']
  })
}

/** The repeated password must match the first one */
export function matchRule (repeat: SchemaPath<string>, password: SchemaPath<string>): void {
  validate(repeat, ({ value, valueOf }) => {
    if (value() === '') return { kind: 'required', message: 'Type the password again' }
    return value() !== valueOf(password) ? { kind: 'passwordMismatch', message: "The passwords don't match" } : undefined
  })
}

export function otpRules (path: SchemaPath<string>): void {
  textRules(path, { required: 'Enter the 4-digit code', pattern: [OTPRegex, 'The code is 4 digits'] })
  maxLength(path, 4) // also sets the input's maxlength
}

export function zipRules (path: SchemaPath<string>, required = 'Enter your PIN code', pattern = 'Enter a 6-digit PIN code'): void {
  textRules(path, { required, pattern: [ZipRegex, pattern] })
}

export function mobileRules (path: SchemaPath<string>): void {
  textRules(path, { pattern: [mobileRegex, 'Enter a 10-digit mobile number'] })
}

/** Date of birth: old enough, and not before MinDate */
export function dobRules (path: SchemaPath<string>): void {
  validate(path, ({ value }) => {
    const selected = new Date(value())
    const today = new Date()
    const minAgeDate = new Date(today.getFullYear() - MinAge, today.getMonth(), today.getDate())
    if (selected > minAgeDate) return { kind: 'minAge', message: `You need to be at least ${MinAge} years old` }
    if (selected < MinDate) return { kind: 'minDate', message: 'Choose a date after 1960' }
    return undefined
  })
}
