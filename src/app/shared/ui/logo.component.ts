import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'cs-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="link()" class="inline-flex items-center gap-2 rounded-control text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <img src="assets/logo-1x1.png" alt="" class="size-8" width="32" height="32" />
      <span class="font-display text-2xl font-extrabold tracking-wide">CineSnap</span>
    </a>
  `
})
export class LogoComponent {
  readonly link = input('/')
}
