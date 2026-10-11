import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { GoogleSigninButtonDirective } from '@abacritt/angularx-social-login'
import { ThemeService } from 'src/app/core/theme/theme.service'

/**
 * Google's own sign-in button (Google Identity Services renders it in an iframe; its look can't be restyled).
 * The result arrives through SocialAuthService.authState, see connectGoogleSignIn().
 */
@Component({
  selector: 'cs-google-button',
  imports: [GoogleSigninButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-11 justify-center' },
  template: `
    <!-- Google renders the button once, so swap instances to follow the theme -->
    @if (theme.theme() === 'dark') {
      <asl-google-signin-button type="standard" size="large" shape="pill" theme="filled_black" [text]="text()" [width]="width" />
    } @else {
      <asl-google-signin-button type="standard" size="large" shape="pill" theme="outline" [text]="text()" [width]="width" />
    }
  `
})
export class GoogleButtonComponent {
  protected readonly theme = inject(ThemeService)
  readonly text = input<'signin_with' | 'signup_with' | 'continue_with'>('continue_with')
  protected readonly width = 320 // px; Google's maximum is 400
}
