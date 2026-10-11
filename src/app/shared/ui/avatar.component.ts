import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core'

const SIZES = { sm: 'size-8 text-sm', md: 'size-10 text-base', lg: 'size-16 text-2xl', xl: 'size-24 font-display text-5xl' }

/** Round picture of a person or theater; falls back to their initial when there's no image or it fails to load. */
@Component({
  selector: 'cs-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0 rounded-full' },
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" alt="" [class]="'rounded-full object-cover ' + sizeClass()" (error)="failed.set(true)" />
    } @else {
      <span aria-hidden="true" [class]="'flex items-center justify-center rounded-full bg-muted font-semibold text-accent ' + sizeClass()">{{ initial() }}</span>
    }
  `
})
export class AvatarComponent {
  readonly name = input.required<string>()
  readonly src = input<string | null>(null)
  readonly size = input<keyof typeof SIZES>('md')

  /** Set when the image fails to load; a new src gets a fresh try */
  protected readonly failed = linkedSignal({ source: this.src, computation: () => false })

  protected readonly initial = computed(() => this.name().charAt(0).toUpperCase())
  protected readonly sizeClass = computed(() => SIZES[this.size()])
}
