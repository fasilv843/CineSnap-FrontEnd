import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Keep in sync with the inline script in src/index.html, which applies the class before Angular boots.
// A saved choice wins; otherwise follow the OS setting.
function initialTheme (): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Puts exactly one of .light / .dark on <html>; styles.css defines the role colors for each. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT)

  readonly theme = signal<Theme>(initialTheme())

  constructor () {
    effect(() => {
      const root = this.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(this.theme())
    })
  }

  /** Switches theme and remembers the choice; until then the OS setting is used */
  toggle (): void {
    this.theme.update(theme => theme === 'dark' ? 'light' : 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, this.theme())
    } catch {}
  }
}
