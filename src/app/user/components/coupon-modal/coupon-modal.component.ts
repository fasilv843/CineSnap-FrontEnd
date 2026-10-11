import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { type ICouponRes } from 'src/app/core/models/coupon.model'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'

/** Lists every coupon for a booking; closes with the coupon the user taps (tapping the applied one removes it). */
@Component({
  selector: 'app-coupon-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  template: `
    <div class="card mx-auto w-[min(32rem,calc(100vw-2rem))] p-6 shadow-raised" role="dialog" aria-labelledby="coupons-title">
      <h2 id="coupons-title" class="text-xl font-semibold">Coupons for this booking</h2>
      <ul class="mt-4 divide-y" role="list">
        @for (coupon of coupons(); track coupon._id) {
          @let applied = coupon._id === appliedId();
          <li class="flex items-center justify-between gap-4 py-3">
            <div class="min-w-0">
              <p class="font-semibold">{{ coupon.code }}</p>
              <p class="text-sm text-muted">{{ coupon.description }}</p>
              <p class="mt-0.5 text-xs text-subtle">
                {{ coupon.discountType === 'Percentage' ? coupon.discount + '% off tickets' : '₹' + coupon.discount + ' off' }}
                @if (coupon.minTicketCount > 1) { · {{ coupon.minTicketCount }}+ tickets }
              </p>
            </div>
            <button csButton size="sm" type="button" [variant]="applied ? 'secondary' : 'accent'" [attr.aria-pressed]="applied" (click)="modal.close(coupon)">
              {{ applied ? 'Remove' : 'Apply' }}
            </button>
          </li>
        }
      </ul>
      <div class="mt-4 flex justify-end">
        <button csButton variant="ghost" type="button" (click)="modal.dismiss('cancel')">Close</button>
      </div>
    </div>
  `
})
export class CouponModalComponent {
  protected readonly modal = inject(ActiveModal)
  readonly coupons = signal<ICouponRes[]>([])
  readonly appliedId = signal<string | null>(null)
}
