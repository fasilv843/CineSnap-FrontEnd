import { Directive, computed, input } from '@angular/core'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

const base = `inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors ${focus} ` +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Exclude<ButtonVariant, 'link'>, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
  ghost: 'text-default hover:bg-muted',
  // Quiet destructive action, e.g. Log out
  danger: 'text-danger hover:bg-muted'
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg'
}

const link = `rounded-sm font-medium text-default underline decoration-accent underline-offset-4 hover:text-accent ${focus}`

/** Themed styles for native <button> and <a> elements: <a csButton variant="secondary" routerLink="...">. */
@Directive({
  selector: 'button[csButton], a[csButton]',
  host: { '[class]': 'classes()' }
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary')
  readonly size = input<ButtonSize>('md')

  protected readonly classes = computed(() => {
    const variant = this.variant()
    return variant === 'link' ? link : `${base} ${variants[variant]} ${sizes[this.size()]}`
  })
}
