import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { WalletTopUpService } from 'src/app/services/wallet-top-up.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-thr-profile',
  templateUrl: './thr-profile.component.html',
  styleUrl: './thr-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AvatarComponent, ButtonDirective]
})
export class ThrProfileComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  private readonly walletTopUp = inject(WalletTopUpService)

  protected readonly theater = this.store.selectSignal(selectTheaterDetails)

  protected readonly avatarUrl = computed(() => {
    const pic = this.theater()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : null
  })

  protected readonly address = computed(() => {
    const address = this.theater()?.address
    if (address === undefined) return null
    return [address.landmark, address.city, address.district, address.state, address.country].filter(Boolean).join(', ') +
      (address.zip !== undefined ? ` ${address.zip}` : '')
  })

  protected readonly mobile = computed(() => {
    const mobile = this.theater()?.mobile
    return mobile !== undefined && mobile !== 0 ? `${mobile}` : null
  })

  protected addMoney (): void {
    const theater = this.theater()
    if (theater !== null) this.walletTopUp.addTheaterMoney(theater)
  }

  protected logout (): void {
    localStorage.removeItem('theaterAccessToken')
    localStorage.removeItem('theaterRefreshToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/login'])
  }
}
