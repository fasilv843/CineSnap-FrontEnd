import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { LogoComponent } from 'src/app/shared/ui/logo.component'
import { ThemeToggleComponent } from 'src/app/shared/ui/theme-toggle.component'

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, ButtonDirective, LogoComponent, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh flex-col bg-page px-4 py-6 text-default sm:px-8">
      <div class="flex items-center justify-between">
        <cs-logo />
        <cs-theme-toggle />
      </div>
      <main class="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center py-12">
        <p class="font-display text-[7rem] font-extrabold leading-none tracking-tight text-accent sm:text-[9rem]">404</p>
        <h1 class="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">This seat doesn't exist</h1>
        <p class="mt-3 text-lg text-muted">The page may have moved, or the link has a typo.</p>
        <div class="mt-8 flex flex-wrap gap-2">
          <button csButton type="button" (click)="goBack()">Go back</button>
          <a csButton variant="secondary" routerLink="/">CineSnap home</a>
        </div>
      </main>
    </div>
  `
})
export class NotFoundComponent {
  protected goBack (): void {
    window.history.back()
  }
}
