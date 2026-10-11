import { type ITicketView } from '../../core/models/ticket.model'

export type TicketStatus = 'upcoming' | 'showing' | 'over' | 'cancelled'

/** A ticket flattened for the theater and admin ticket tables; deleted references read as "… removed" */
export interface TicketRow {
  id: string
  movie: string
  poster: string | null
  theater: string
  screen: string
  customer: string
  customerEmail: string
  start: Date
  seats: string[]
  amount: number
  payment: string
  status: TicketStatus
  cancelledBy?: 'User' | 'Theater' | 'Admin'
}

export function toTicketRow (ticket: ITicketView, now = new Date()): TicketRow {
  const start = new Date(ticket.startTime)
  const end = new Date(ticket.endTime)
  const movie = ticket.movieId
  return {
    id: ticket._id,
    movie: movie?.title ?? 'Movie removed',
    poster: movie != null ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null,
    theater: ticket.theaterId?.name ?? 'Theater removed',
    screen: ticket.screenId?.name ?? 'Screen removed',
    customer: ticket.userId?.name ?? 'Account removed',
    customerEmail: ticket.userId?.email ?? '',
    start,
    seats: [ticket.diamondSeats, ticket.goldSeats, ticket.silverSeats].flatMap(line => line?.seats ?? []).sort(),
    amount: ticket.totalPrice,
    payment: ticket.paymentMethod,
    status: ticket.isCancelled ? 'cancelled' : end < now ? 'over' : start <= now ? 'showing' : 'upcoming',
    cancelledBy: ticket.cancelledBy
  }
}

export const STATUS_LABEL: Record<TicketStatus, string> = {
  upcoming: 'Upcoming',
  showing: 'Showing now',
  over: 'Show over',
  cancelled: 'Cancelled'
}

export const STATUS_TONE: Record<TicketStatus, string | null> = {
  upcoming: 'primary',
  showing: 'success',
  over: null,
  cancelled: 'danger'
}

export function cancelledLabel (row: TicketRow): string {
  return row.cancelledBy === undefined ? 'Cancelled' : row.cancelledBy === 'User' ? 'Cancelled by customer' : `Cancelled by ${row.cancelledBy.toLowerCase()}`
}
