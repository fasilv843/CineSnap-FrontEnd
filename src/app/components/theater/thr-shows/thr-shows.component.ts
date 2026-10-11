import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { dateToString } from 'src/app/helpers/date'
import { toMovieCard } from 'src/app/helpers/movie-card'
import { type IShowRequirements } from 'src/app/models/show'
import { ModalService } from 'src/app/services/modal.service'
import { ShowService } from 'src/app/services/show.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { DayPickerComponent } from 'src/app/shared/ui/day-picker.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { ShowFormModalComponent, type ShowFormResult } from '../show-form-modal/show-form-modal.component'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

@Component({
  selector: 'app-thr-shows',
  templateUrl: './thr-shows.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, ButtonDirective, DayPickerComponent, PageHeaderComponent, StatePanelComponent]
})
export class ThrShowsComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly showService = inject(ShowService)
  private readonly modalService = inject(ModalService)
  private readonly toast = inject(ToastService)

  private readonly theater = inject(Store).selectSignal(selectTheaterDetails)

  // The day lives in ?date=YYYY-MM-DD so reloads and back keep it
  private readonly query = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly date = computed(() => {
    const key = this.query().get('date')
    return key !== null && DATE_KEY.test(key) ? key : dateToString(new Date())
  })

  protected readonly dateLabel = computed(() => {
    const [year, month, day] = this.date().split('-').map(Number)
    return new Date(year, month - 1, day)
  })

  protected readonly screens = rxResource({
    params: () => ({ theaterId: this.theater()?._id ?? '', date: this.date() }),
    stream: ({ params }) => this.showService.findShowsOnDateForTheater(params.theaterId, params.date).pipe(
      map(res => (res.data ?? []).map(screen => ({
        id: screen.screenId,
        name: screen.screenName,
        movies: screen.shows.map(group => ({
          movie: group.movieId != null ? toMovieCard(group.movieId) : null,
          shows: [...group.shows]
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map(show => ({
              id: show._id,
              start: show.startTime,
              end: show.endTime,
              sold: show.totalSeatCount - show.availableSeatCount,
              total: show.totalSeatCount
            }))
        }))
      })).filter(screen => screen.movies.length > 0))
    )
  })

  protected selectDate (key: string): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { date: key }, replaceUrl: true })
  }

  protected addShow (): void {
    const ref = this.modalService.open(ShowFormModalComponent, { static: true })
    ref.componentInstance.date.set(this.date())
    ref.result.then((result: ShowFormResult) => {
      this.showService.addShow(result as unknown as IShowRequirements).subscribe(res => {
        if (res.data === null) return
        this.toast.success('Show added', 'Tickets are on sale now.')
        // Jump to the new show's day; on the same day, just refresh
        if (result.date === this.date()) this.screens.reload()
        else this.selectDate(result.date)
      })
    }, () => {})
  }

  protected fill (show: { sold: number, total: number }): number {
    return show.total > 0 ? Math.round((show.sold / show.total) * 100) : 0
  }
}
