import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { isTokenExpired } from 'src/app/helpers/jwt-token'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { LogoComponent } from 'src/app/shared/ui/logo.component'
import { ThemeToggleComponent } from 'src/app/shared/ui/theme-toggle.component'

interface Seat { lit: boolean, delay: number }

const ROWS = 6
const COLS = 14
// Seats that light up in the accent color during the load sequence, as [row, col]
const LIT: Array<[number, number]> = [[2, 6], [2, 7], [2, 8], [3, 3], [4, 10], [4, 11], [5, 5]]

function hasValidUserSession (): boolean {
  try {
    const token = localStorage.getItem('userRefreshToken')
    return token !== null && !isTokenExpired(token)
  } catch {
    return false
  }
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ButtonDirective, LogoComponent, ThemeToggleComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  protected readonly signedIn = signal(hasValidUserSession())
  protected readonly year = new Date().getFullYear()

  protected readonly rows: Seat[][] = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      const order = LIT.findIndex(([lr, lc]) => lr === r && lc === c)
      return { lit: order !== -1, delay: 400 + order * 180 }
    })
  )

  protected readonly features = [
    { title: 'Shows near you', body: 'Find what\'s playing at theaters around your location, with showtimes for the days ahead.' },
    { title: 'Choose your seat', body: 'Pick exact seats on the theater\'s live seat map before you pay.' },
    { title: 'Wallet and coupons', body: 'Pay from your CineSnap wallet or by card, and apply theater coupons at checkout.' }
  ]
}
