import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { DatePipe } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { WalletTopUpService } from 'src/app/services/wallet-top-up.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { deleteUserFromStore } from 'src/app/states/user/user.actions'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, AvatarComponent, ButtonDirective, DatePipe]
})
export class UserProfileComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  private readonly walletTopUp = inject(WalletTopUpService)

  protected readonly user = this.store.selectSignal(selectUserDetails)

  protected readonly avatarUrl = computed(() => {
    const pic = this.user()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : null
  })

  protected readonly location = computed(() => {
    const address = this.user()?.address
    if (address === undefined) return null
    return [address.city, address.district, address.state, address.country].filter(Boolean).join(', ') + (address.zip !== undefined ? ` ${address.zip}` : '')
  })

  protected addMoney (): void {
    const user = this.user()
    if (user !== null) this.walletTopUp.addMoney(user)
  }

  protected logout (): void {
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('userRefreshToken')
    this.store.dispatch(deleteUserFromStore())
    void this.router.navigate(['/user/home'])
  }
}
