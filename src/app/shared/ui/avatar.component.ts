import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

const SIZES = { sm: 'size-8 text-sm', md: 'size-10 text-base', lg: 'size-16 text-2xl' }

/** Round picture of a person or theater; falls back to their initial when there's no image. */
@Component({
  selector: 'cs-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    @if (src()) {
      <img [src]="src()" alt="" [class]="'rounded-full object-cover ' + sizeClass()" />
    } @else {
      <span aria-hidden="true" [class]="'flex items-center justify-center rounded-full bg-muted font-semibold text-accent ' + sizeClass()">{{ initial() }}</span>
    }
  `
})
export class AvatarComponent {
  readonly name = input.required<string>()
  readonly src = input<string | null>(null)
  readonly size = input<keyof typeof SIZES>('md')

  protected readonly initial = computed(() => this.name().charAt(0).toUpperCase())
  protected readonly sizeClass = computed(() => SIZES[this.size()])
}
