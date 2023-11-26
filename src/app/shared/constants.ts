export const emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
export const passwordMinLength = 8
export const OTPRegex = '^[1-9][0-9]{3}$'
export const ZipRegex = '^[1-9][0-9]{5}$'
export const userNameMinLength = 3
export const userNameMaxLength = 20
export const nameRegex = '^[a-zA-Z ]{3,20}$'
export const passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'
export const charRegex = /^[A-Z]$/
export const numRegex = '^\\d+$'

export const OTP_TIMER = 60 * 3 // 3 min in seconds
export const MAX_OTP_LIMIT = 3
export const MIN_COLS = 5
export const MAX_COLS = 30
export const MIN_TICKET_PRICE = 50
export const MAX_TICKET_PRICE = 5000
