import { Injectable, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'
import { type Movie } from 'src/app/core/models/movie.model'
import { AdminMovieRepo } from 'src/app/admin/repos/movie.repo'
import { ToastService } from 'src/app/core/toast/toast.service'
import { valueOf } from 'src/app/shared/utils/resource'

/** Which TMDB movies are already on CineSnap, and adding (or refreshing) one. Shared by the admin movie pages. */
@Injectable({ providedIn: 'root' })
export class TmdbImportService {
  private readonly movieRepo = inject(AdminMovieRepo)
  private readonly toast = inject(ToastService)

  private readonly loaded = rxResource({
    stream: () => this.movieRepo.fetchCineSnapMovies().pipe(map(res => new Set(res.data)))
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
    this.movieRepo.saveMovie(movie).subscribe({
      next: () => {
        done()
        this.ids.update(set => new Set(set).add(id))
        this.toast.success(updating ? `${movie.title} updated` : `${movie.title} added to CineSnap`, updating ? undefined : 'Theaters can schedule it now.')
      },
      error: done
    })
  }
}
