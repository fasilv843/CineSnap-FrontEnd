import { Injectable, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'
import { type Movie } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { valueOf } from 'src/app/helpers/resource'

/** Which TMDB movies are already on CineSnap, and adding (or refreshing) one. Shared by the admin movie pages. */
@Injectable({ providedIn: 'root' })
export class TmdbImportService {
  private readonly movieService = inject(MovieService)
  private readonly toast = inject(ToastService)

  private readonly loaded = rxResource({
    stream: () => this.movieService.fetchCineSnapMovies().pipe(map(res => new Set(res.data)))
  })

  /** TMDB ids on CineSnap; grows as movies are added */
  readonly ids = linkedSignal(() => valueOf(this.loaded) ?? new Set<number>())
  readonly saving = signal<ReadonlySet<number>>(new Set())

  reload (): void {
    this.loaded.reload()
  }

  add (movie: Movie): void {
    const id = movie.tmdbId
    const updating = this.ids().has(id)
    this.saving.update(set => new Set(set).add(id))
    const done = (): void => { this.saving.update(set => { const next = new Set(set); next.delete(id); return next }) }
    this.movieService.saveMovie(movie).subscribe({
      next: () => {
        done()
        this.ids.update(set => new Set(set).add(id))
        this.toast.success(updating ? `${movie.title} updated` : `${movie.title} added to CineSnap`, updating ? undefined : 'Theaters can schedule it now.')
      },
      error: done
    })
  }
}
