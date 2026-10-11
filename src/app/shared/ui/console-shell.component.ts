import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu'
import { A11yModule } from '@angular/cdk/a11y'
import { NgTemplateOutlet } from '@angular/common'
import { filter } from 'rxjs'
import { AvatarComponent } from './avatar.component'
import { IconComponent } from './icon.component'
import { type IconName } from './icons'
import { LogoComponent } from './logo.component'
import { ThemeToggleComponent } from './theme-toggle.component'

export interface ConsoleLink {
  label: string
  path: string
  icon: IconName
}

/**
 * Layout for the theater and admin areas: a sidebar on wide screens, a top bar with a slide-in menu on phones.
 * Page content is projected: <cs-console-shell ...><router-outlet /></cs-console-shell>
 */
@Component({
  selector: 'cs-console-shell',
  imports: [RouterLink, RouterLinkActive, CdkMenu, CdkMenuItem, CdkMenuTrigger, A11yModule, NgTemplateOutlet, AvatarComponent, IconComponent, LogoComponent, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #navList>
      <nav class="flex flex-col gap-0.5" [attr.aria-label]="area() + ' menu'">
        @for (link of links(); track link.path) {
          <a [routerLink]="link.path" routerLinkActive="nav-active" ariaCurrentWhenActive="page" class="nav-link">
            <cs-icon [name]="link.icon" class="size-5" />
            {{ link.label }}
          </a>
        }
      </nav>
    </ng-template>

    <ng-template #account>
      <button type="button" [cdkMenuTriggerFor]="accountMenu" class="account-button" aria-label="Account menu">
        <cs-avatar [name]="accountName() || area()" [src]="avatarSrc()" size="sm" />
        <span class="min-w-0 flex-1 text-left">
          <span class="block truncate text-sm font-semibold">{{ accountName() || area() }}</span>
          @if (accountDetail()) {
            <span class="block truncate text-xs text-muted">{{ accountDetail() }}</span>
          }
        </span>
      </button>
    </ng-template>

    <ng-template #accountMenu>
      <div cdkMenu class="min-w-56 rounded-card border border-default bg-raised p-1.5 text-default shadow-raised">
        @for (link of accountLinks(); track link.path) {
          <a cdkMenuItem [routerLink]="link.path" class="menu-item">{{ link.label }}</a>
        }
        @if (accountLinks().length > 0) {
          <div class="my-1 border-t border-default"></div>
        }
        <button cdkMenuItem type="button" (click)="logout.emit()" class="menu-item w-full text-left text-danger">Log out</button>
      </div>
    </ng-template>

    <div class="min-h-dvh bg-page text-default lg:grid lg:grid-cols-[16rem_1fr]">
      <!-- Sidebar (wide screens) -->
      <aside class="sticky top-0 hidden h-dvh flex-col border-r border-default bg-surface px-3 py-5 lg:flex">
        <div class="flex items-center justify-between gap-2 px-2">
          <cs-logo [link]="home()" />
          <span class="badge">{{ area() }}</span>
        </div>
        <div class="mt-8 flex-1 overflow-y-auto">
          <ng-container [ngTemplateOutlet]="navList" />
        </div>
        <div class="mt-4 flex items-center gap-1 border-t border-default pt-4">
          <div class="min-w-0 flex-1"><ng-container [ngTemplateOutlet]="account" /></div>
          <cs-theme-toggle />
        </div>
      </aside>

      <!-- Top bar (phones and tablets) -->
      <header class="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-default bg-surface/90 px-4 backdrop-blur lg:hidden">
        <button type="button" class="-ml-2 rounded-control p-2 hover:bg-muted" (click)="drawerOpen.set(true)" aria-label="Open menu"
          [attr.aria-expanded]="drawerOpen()" aria-controls="console-drawer">
          <cs-icon name="menu" class="size-6" />
        </button>
        <cs-logo [link]="home()" />
        <span class="badge hidden sm:inline-flex">{{ area() }}</span>
        <div class="ml-auto flex items-center gap-1">
          <cs-theme-toggle />
          <button type="button" [cdkMenuTriggerFor]="accountMenu" class="rounded-full" aria-label="Account menu">
            <cs-avatar [name]="accountName() || area()" [src]="avatarSrc()" size="sm" />
          </button>
        </div>
      </header>

      @if (drawerOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-scrim/60" (click)="drawerOpen.set(false)" aria-hidden="true"></div>
          <aside id="console-drawer" class="drawer absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface px-3 py-5 shadow-raised"
            role="dialog" aria-modal="true" [attr.aria-label]="area() + ' menu'" cdkTrapFocus cdkTrapFocusAutoCapture (keydown.escape)="drawerOpen.set(false)">
            <div class="flex items-center justify-between px-2">
              <cs-logo [link]="home()" />
              <button type="button" class="rounded-control p-2 hover:bg-muted" (click)="drawerOpen.set(false)" aria-label="Close menu">
                <cs-icon name="close" class="size-5" />
              </button>
            </div>
            <div class="mt-6 flex-1 overflow-y-auto">
              <ng-container [ngTemplateOutlet]="navList" />
            </div>
            <div class="mt-4 border-t border-default pt-4">
              <ng-container [ngTemplateOutlet]="account" />
            </div>
          </aside>
        </div>
      }

      <div class="min-w-0">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: var(--radius-control);
      font-weight: 600;
      color: var(--text-color-muted);
      transition: background-color 150ms, color 150ms;
    }

    .nav-link:hover {
      background-color: var(--background-color-muted);
      color: var(--text-color-default);
    }

    .nav-active,
    .nav-active:hover {
      background-color: var(--color-secondary);
      color: var(--color-secondary-foreground);
      box-shadow: inset 3px 0 0 var(--color-primary);
    }

    .account-button {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--radius-control);
    }

    .account-button:hover {
      background-color: var(--background-color-muted);
    }

    .menu-item {
      display: block;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-control);
      font-size: 0.9375rem;
      cursor: pointer;
    }

    .menu-item:hover,
    .menu-item:focus-visible {
      outline: none;
      background-color: var(--background-color-muted);
    }

    .drawer {
      animation: drawer-in 200ms ease-out;
    }

    @keyframes drawer-in {
      from { transform: translateX(-100%); }
      to { transform: none; }
    }
  `
})
export class ConsoleShellComponent {
  /** Shown as a badge next to the logo, e.g. "Theater" */
  readonly area = input.required<string>()
  readonly home = input.required<string>()
  readonly links = input.required<ConsoleLink[]>()
  readonly accountLinks = input<Array<{ label: string, path: string }>>([])
  readonly accountName = input('')
  readonly accountDetail = input('')
  readonly avatarSrc = input<string | null>(null)
  readonly logout = output()

  protected readonly drawerOpen = signal(false)

  constructor () {
    // Following a link in the phone menu closes it
    inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(inject(DestroyRef))
    ).subscribe(() => { this.drawerOpen.set(false) })
  }
}
