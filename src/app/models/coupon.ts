export interface ICoupon {
  _id: string
  code: string
  theaterId: string
  description: string
  startDate: Date
  endDate: Date
  discount: number
  minTicketCount: number
  couponType: 'Once' | 'Weekly' | 'Monthly' | 'Yearly'
  discountType: 'Fixed Amount' | 'Percentage'
  maxDiscountAmt: number
  isCancelled: boolean
  couponCount?: number
}

export interface ICouponReqs extends Omit<ICoupon, '_id' | 'isCancelled'> {}
export interface ICouponRes extends Omit<ICoupon, 'couponCount'> {
  couponCount: number
}
