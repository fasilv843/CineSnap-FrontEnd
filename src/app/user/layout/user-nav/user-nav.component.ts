import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu'
import { Store } from '@ngrx/store'
import { imagesFolderPath } from 'src/app/shared/constants'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { deleteUserFromStore } from 'src/app/states/user/user.actions'
import { LocationService } from 'src/app/services/location.service'
import { LogoComponent } from 'src/app/shared/ui/logo.component'
import { ThemeToggleComponent } from 'src/app/shared/ui/theme-toggle.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'

interface NavLink { label: string, path: string, icon: string }

// 24x24 stroke icon paths, shared by the desktop links and the mobile tab bar
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  movies: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  theaters: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'
}

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CdkMenu, CdkMenuItem, CdkMenuTrigger, LogoComponent, ThemeToggleComponent, ButtonDirective, AvatarComponent]
})
export class UserNavComponent {
  private readonly router = inject(Router)
  private readonly store = inject(Store)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  protected readonly avatarUrl = computed(() => {
    const pic = this.user()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : null
  })

  protected readonly icons = ICONS

  protected readonly links: NavLink[] = [
    { label: 'Home', path: '/user/home', icon: ICONS.home },
    { label: 'Movies', path: '/user/movies', icon: ICONS.movies },
    { label: 'Theaters', path: '/user/theaters', icon: ICONS.theaters }
  ]

  constructor () {
    // Theaters near the user drive home and the theaters page; ask once per session
    inject(LocationService).request()
  }

  logout (): void {
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('userRefreshToken')
    this.store.dispatch(deleteUserFromStore())
    void this.router.navigate(['/user/home'])
  }
}
