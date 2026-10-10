import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Keep in sync with the inline script in src/index.html, which applies the class before Angular boots.
// Defaults to light (not the OS setting) until every page uses role colors; un-redesigned pages hard-code light colors.
function initialTheme (): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'light'
}

/** Puts exactly one of .light / .dark on <html>; styles.css defines the role colors for each. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT)

  readonly theme = signal<Theme>(initialTheme())

  constructor () {
    effect(() => {
      const theme = this.theme()
      const root = this.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      try {
        localStorage.setItem(STORAGE_KEY, theme)
      } catch {}
    })
  }

  toggle (): void {
    this.theme.update(theme => theme === 'dark' ? 'light' : 'dark')
  }
}
