import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { ThemeService } from 'src/app/services/theme.service'

@Component({
  selector: 'cs-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="theme.toggle()" [attr.aria-pressed]="isDark()" [attr.aria-label]="label()" [title]="label()"
      class="inline-flex size-10 items-center justify-center rounded-control text-muted transition-colors hover:bg-muted hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      @if (isDark()) {
        <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      } @else {
        <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService)
  protected readonly isDark = computed(() => this.theme.theme() === 'dark')
  protected readonly label = computed(() => this.isDark() ? 'Switch to light theme' : 'Switch to dark theme')
}
