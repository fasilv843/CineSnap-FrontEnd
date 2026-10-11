import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DatePipe } from '@angular/common'
import { type Movie } from 'src/app/core/models/movie.model'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { TmdbImportService } from '../../services/tmdb-import.service'

/** A TMDB movie poster with "Add to CineSnap" (or "Update" when it's already there). */
@Component({
  selector: 'app-tmdb-movie-card',
  imports: [DatePipe, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @let m = movie();
    <figure>
      <div class="relative">
        <img [src]="'https://image.tmdb.org/t/p/w342' + m.poster_path" [alt]="m.title + ' poster'" class="aspect-[2/3] w-full rounded-card bg-muted object-cover" loading="lazy" />
        @if (added()) {
          <span class="absolute left-2 top-2 rounded-full bg-surface shadow-raised"><span class="status-pill" data-tone="success">On CineSnap</span></span>
        }
      </div>
      <figcaption class="mt-2">
        <span class="line-clamp-1 font-semibold">{{ m.title }}</span>
        <span class="text-sm text-muted">{{ m.release_date | date: 'y' }}</span>
      </figcaption>
    </figure>
    <button csButton size="sm" type="button" class="mt-2 w-full" [variant]="added() ? 'secondary' : 'primary'" [disabled]="saving()" (click)="importer.add(m)">
      @if (saving()) { <span class="spinner"></span> Saving… } @else { {{ added() ? 'Update details' : 'Add to CineSnap' }} }
      <span class="sr-only"> {{ m.title }}</span>
    </button>
  `
})
export class TmdbMovieCardComponent {
  protected readonly importer = inject(TmdbImportService)
  readonly movie = input.required<Movie>()

  protected readonly added = computed(() => this.importer.ids().has(this.movie().tmdbId))
  protected readonly saving = computed(() => this.importer.saving().has(this.movie().tmdbId))
}
