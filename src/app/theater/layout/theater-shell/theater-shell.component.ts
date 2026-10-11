import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { Store } from '@ngrx/store'
import { imagesFolderPath } from 'src/app/shared/constants'
import { ConsoleShellComponent, type ConsoleLink } from 'src/app/shared/ui/console-shell.component'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

/** Layout route for the signed-in theater area; pages render in the outlet. */
@Component({
  selector: 'app-thr-shell',
  imports: [RouterOutlet, ConsoleShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-console-shell area="Theater" home="/theater/home" [links]="links()" [accountLinks]="accountLinks"
      [accountName]="theater()?.name ?? ''" [accountDetail]="walletLabel()" [avatarSrc]="avatarSrc()" (logout)="logout()">
      <router-outlet />
    </cs-console-shell>
  `
})
export class ThrShellComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  protected readonly theater = this.store.selectSignal(selectTheaterDetails)

  protected readonly links = computed<ConsoleLink[]>(() => [
    { label: 'Dashboard', path: '/theater/home', icon: 'dashboard' },
    { label: 'Shows', path: '/theater/shows', icon: 'shows' },
    { label: 'Screens', path: '/theater/screens', icon: 'screens' },
    { label: 'Movies', path: '/theater/movies', icon: 'movies' },
    { label: 'Tickets', path: `/theater/tickets/${this.theater()?._id ?? ''}`, icon: 'tickets' },
    { label: 'Coupons', path: '/theater/coupons', icon: 'coupons' },
    { label: 'Messages', path: '/theater/messages', icon: 'messages' }
  ])

  protected readonly accountLinks = [
    { label: 'Profile', path: '/theater/profile' },
    { label: 'Wallet history', path: '/theater/profile/wallet-history' }
  ]

  protected readonly walletLabel = computed(() => {
    const theater = this.theater()
    return theater !== null ? `Wallet ₹${theater.wallet}` : ''
  })

  protected readonly avatarSrc = computed(() => {
    const pic = this.theater()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : null
  })

  protected logout (): void {
    localStorage.removeItem('theaterAccessToken')
    localStorage.removeItem('theaterRefreshToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/login'])
  }
}
