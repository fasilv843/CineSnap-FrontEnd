export const MALAYALAM = 'ml'
export const ENGLISH = 'en'
export const HINDI = 'hi'
export const TELUGU = 'te'
export const TAMIL = 'ta'
export const BENGALI = 'bn'
export const KANNADA = 'kn'
export const JAPAN = 'ja'
export const FRENCH = 'fr'
export const SPANISH = 'es'

export enum Language {
  MALAYALAM = 'ml',
  ENGLISH = 'en',
  HINDI = 'hi',
  TELUGU = 'te',
  TAMIL = 'ta',
  BENGALI = 'bn',
  KANNADA = 'kn',
  JAPAN = 'ja',
  FRENCH = 'fr',
  SPANISH = 'es',
}

export enum LanguageAbbreviation {
  ml = 'Malayalam',
  en = 'English',
  hi = 'Hindi',
  te = 'Telugu',
  ta = 'Tamil',
  bn = 'Bengali',
  kn = 'Kannada',
  ja = 'Japanese',
  fr = 'French',
  es = 'Spanish'
}

// if i change like this can i use LanguageAbbreviation[Language.MALAYALAM], is this possible
