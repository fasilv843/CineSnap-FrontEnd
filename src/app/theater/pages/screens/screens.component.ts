import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { type IScreen } from 'src/app/models/screens'
import { ModalService } from 'src/app/services/modal.service'
import { ScreenService } from 'src/app/services/screen.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { ScreenFormModalComponent, type ScreenFormResult } from '../screen-form-modal/screen-form-modal.component'
import { valueOf } from 'src/app/helpers/resource'

@Component({
  selector: 'app-thr-screens',
  templateUrl: './thr-screens.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, PageHeaderComponent, StatePanelComponent]
})
export class ThrScreensComponent {
  private readonly screenService = inject(ScreenService)
  private readonly modalService = inject(ModalService)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)
  private readonly router = inject(Router)

  private readonly theater = inject(Store).selectSignal(selectTheaterDetails)
  private readonly theaterId = computed(() => this.theater()?._id ?? '')

  protected readonly loaded = rxResource({
    params: () => this.theaterId(),
    stream: ({ params }) => this.screenService.findScreens(params).pipe(map(res => res.data ?? []))
  })

  // Local copy so a delete shows at once
  protected readonly screens = linkedSignal<IScreen[]>(() => valueOf(this.loaded) ?? [])
  protected readonly deleting = signal<string | null>(null)
  protected readonly adding = signal(false)

  protected addScreen (): void {
    this.modalService.open(ScreenFormModalComponent, { static: true }).result.then((result: ScreenFormResult) => {
      this.adding.set(true)
      this.screenService.addScreen({ ...result, theaterId: this.theaterId() }).subscribe({
        next: res => {
          this.adding.set(false)
          if (res.data === null) return
          this.toast.success(`${res.data.name} added`, 'Now lay out its seats.')
          void this.router.navigate(['/theater/screens/seat', res.data.seatId])
        },
        error: () => { this.adding.set(false) }
      })
    }, () => {})
  }

  protected async deleteScreen (screen: IScreen): Promise<void> {
    const confirmed = await this.confirm.confirm({
      title: `Delete ${screen.name}?`,
      message: 'Its seat layout is deleted too, and this can\'t be undone.',
      confirmLabel: 'Delete screen',
      cancelLabel: 'Keep it',
      tone: 'danger'
    })
    if (!confirmed) return
    this.deleting.set(screen._id)
    this.screenService.deleteScreen(screen._id).subscribe({
      next: () => {
        this.deleting.set(null)
        this.screens.update(list => list.filter(s => s._id !== screen._id))
        this.toast.success(`${screen.name} deleted`)
      },
      error: () => { this.deleting.set(null) }
    })
  }
}
