import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

/** Tabs between the TMDB catalogue (to add movies) and CineSnap's own list (to manage them). */
@Component({
  selector: 'app-admin-movies-tabs',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tabs" aria-label="Movie sources">
      <a routerLink="/admin/movies/tmdb" routerLinkActive="active" ariaCurrentWhenActive="page" class="tab">Add from TMDB</a>
      <a routerLink="/admin/movies/cinesnap" routerLinkActive="active" ariaCurrentWhenActive="page" class="tab">On CineSnap</a>
    </nav>
  `,
  styles: `
    .tabs {
      display: flex;
      gap: 0.25rem;
      border-bottom: 1px solid var(--border-color-default);
    }

    .tab {
      margin-bottom: -1px;
      padding: 0.625rem 0.875rem;
      border-bottom: 2px solid transparent;
      color: var(--text-color-muted);
      font-weight: 600;
      white-space: nowrap;
    }

    .tab:hover {
      color: var(--text-color-default);
    }

    .tab.active {
      border-bottom-color: var(--color-primary);
      color: var(--text-color-default);
    }
  `
})
export class AdminMoviesTabsComponent {}
