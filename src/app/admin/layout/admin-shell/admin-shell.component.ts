import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { ConsoleShellComponent, type ConsoleLink } from 'src/app/shared/ui/console-shell.component'

/** Layout route for the signed-in admin area; pages render in the outlet. */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, ConsoleShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-console-shell area="Admin" home="/admin/home" [links]="links" accountName="CineSnap admin" (logout)="logout()">
      <router-outlet />
    </cs-console-shell>
  `
})
export class AdminShellComponent {
  private readonly router = inject(Router)

  protected readonly links: ConsoleLink[] = [
    { label: 'Dashboard', path: '/admin/home', icon: 'dashboard' },
    { label: 'Theaters', path: '/admin/theaters', icon: 'theaters' },
    { label: 'Users', path: '/admin/users', icon: 'users' },
    { label: 'Tickets', path: '/admin/tickets', icon: 'tickets' },
    { label: 'Movies', path: '/admin/movies', icon: 'movies' }
  ]

  protected logout (): void {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    void this.router.navigate(['/admin/login'])
  }
}
