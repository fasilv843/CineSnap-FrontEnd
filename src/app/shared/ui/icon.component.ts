import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { ICONS, type IconName } from './icons'

/** Decorative stroke icon: <cs-icon name="tickets" class="size-5" /> */
@Component({
  selector: 'cs-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" class="size-full" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path [attr.d]="path()" />
    </svg>
  `
})
export class IconComponent {
  readonly name = input.required<IconName>()
  protected readonly path = computed(() => ICONS[this.name()])
}
