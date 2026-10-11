import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { Store } from '@ngrx/store'
import {
  createColumnHelper, createPaginatedRowModel, createSortedRowModel, injectTable,
  rowPaginationFeature, rowSortingFeature, type SortingState, tableFeatures
} from '@tanstack/angular-table'
import { map } from 'rxjs'
import { type ICouponReqs, type ICouponRes } from 'src/app/models/coupon'
import { CouponService } from 'src/app/services/coupon.service'
import { ModalService } from 'src/app/services/modal.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { injectUrlPaging } from 'src/app/shared/ui/url-paging'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { CouponFormComponent } from '../coupon-form/coupon-form.component'
import { valueOf } from 'src/app/helpers/resource'

type CouponStatus = 'active' | 'scheduled' | 'expired' | 'off'

interface CouponRow {
  id: string
  code: string
  description: string
  discount: string
  start: Date
  end: Date
  minTickets: number
  usesLeft: number | null
  status: CouponStatus
}

const STATUS: Record<CouponStatus, { label: string, tone: string | null }> = {
  active: { label: 'Active', tone: 'success' },
  scheduled: { label: 'Starts later', tone: 'primary' },
  expired: { label: 'Expired', tone: null },
  off: { label: 'Turned off', tone: 'danger' }
}

function toCouponRow (coupon: ICouponRes, now: Date): CouponRow {
  const start = new Date(coupon.startDate)
  const end = new Date(coupon.endDate)
  end.setHours(23, 59, 59, 999) // a coupon is valid through its last day
  const discount = coupon.discountType === 'Percentage'
    ? `${coupon.discount}% off` + (coupon.maxDiscountAmt > 0 ? `, up to ₹${coupon.maxDiscountAmt}` : '')
    : `₹${coupon.discount} off`
  return {
    id: coupon._id,
    code: coupon.code,
    description: coupon.description,
    discount,
    start,
    end,
    minTickets: coupon.minTicketCount ?? 0,
    usesLeft: typeof coupon.couponCount === 'number' ? coupon.couponCount : null,
    status: coupon.isCancelled ? 'off' : end < now ? 'expired' : start > now ? 'scheduled' : 'active'
  }
}

// Coupons come back in one response, so sorting and paging run in the browser
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel()
})
const column = createColumnHelper<typeof features, CouponRow>()
const columns = column.columns([
  column.accessor('code', { header: 'Coupon' }),
  column.accessor('discount', { header: 'Discount', enableSorting: false }),
  column.accessor(row => row.end.getTime(), { id: 'valid', header: 'Valid' }),
  column.accessor('minTickets', { header: 'Min. tickets' }),
  column.accessor(row => row.usesLeft ?? Infinity, { id: 'usesLeft', header: 'Uses left' }),
  column.accessor('status', { header: 'Status', enableSorting: false }),
  column.display({ id: 'actions', header: 'Actions' })
])

@Component({
  selector: 'app-thr-coupon',
  templateUrl: './thr-coupon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ButtonDirective, PageHeaderComponent, PaginationComponent, StatePanelComponent]
})
export class ThrCouponComponent {
  private readonly couponService = inject(CouponService)
  private readonly modalService = inject(ModalService)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)

  private readonly theater = inject(Store).selectSignal(selectTheaterDetails)
  protected readonly paging = injectUrlPaging()

  protected readonly coupons = rxResource({
    params: () => this.theater()?._id ?? '',
    stream: ({ params }) => this.couponService.findCouponsOnTheater(params).pipe(map(res => res.data ?? []))
  })

  // Local copy so new and toggled coupons show at once
  protected readonly rows = linkedSignal(() => (valueOf(this.coupons) ?? []).map(coupon => toCouponRow(coupon, new Date())))
  protected readonly sorting = signal<SortingState>([{ id: 'valid', desc: true }])
  protected readonly busy = signal<string | null>(null)
  protected readonly status = STATUS

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.rows(),
    getRowId: row => row.id,
    autoResetPageIndex: false,
    state: {
      sorting: this.sorting(),
      pagination: { pageIndex: this.paging.page() - 1, pageSize: this.paging.limit() }
    },
    onSortingChange: updater => {
      this.sorting.update(current => typeof updater === 'function' ? updater(current) : updater)
      this.paging.goToPage(1)
    }
  }))

  protected readonly activeCount = computed(() => this.rows().filter(row => row.status === 'active').length)

  protected addCoupon (): void {
    this.modalService.open(CouponFormComponent, { static: true }).result.then((coupon: Omit<ICouponReqs, 'theaterId'>) => {
      this.couponService.saveCoupon({ ...coupon, theaterId: this.theater()?._id ?? '' }).subscribe(res => {
        if (res.data === null) return
        const saved = res.data
        this.rows.update(rows => [toCouponRow(saved, new Date()), ...rows])
        this.toast.success(`Coupon ${saved.code} created`, 'Movie-goers see it when they book.')
      })
    }, () => {})
  }

  protected async toggle (row: CouponRow): Promise<void> {
    const turningOff = row.status !== 'off'
    if (turningOff) {
      const confirmed = await this.confirm.confirm({
        title: `Turn off ${row.code}?`,
        message: 'Movie-goers can no longer apply it. You can turn it back on later.',
        confirmLabel: 'Turn off',
        cancelLabel: 'Keep it on',
        tone: 'danger'
      })
      if (!confirmed) return
    }
    this.busy.set(row.id)
    this.couponService.cancelCoupon(row.id).subscribe({
      next: res => {
        this.busy.set(null)
        if (res.data === null) return
        const updated = toCouponRow(res.data, new Date())
        this.rows.update(rows => rows.map(r => r.id === row.id ? updated : r))
        this.toast.success(turningOff ? `${row.code} turned off` : `${row.code} turned on`)
      },
      error: () => { this.busy.set(null) }
    })
  }

  protected sortLabel (direction: false | 'asc' | 'desc'): 'ascending' | 'descending' | null {
    return direction === false ? null : direction === 'asc' ? 'ascending' : 'descending'
  }
}
