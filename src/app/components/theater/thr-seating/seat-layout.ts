import { type ColNumType } from 'src/app/models/common'
import { type IScreenSeatCategoryRes, type IScreenSeatRes } from 'src/app/models/screenSeat'

/**
 * Editable seat layout. Each cell is a seat (true) or a gap (false); seat numbers and row letters are derived,
 * so every edit is a pure function from one layout to the next.
 */
export type CategoryKey = 'diamond' | 'gold' | 'silver'
export const CATEGORY_KEYS: CategoryKey[] = ['diamond', 'gold', 'silver']
export const MAX_ROWS = 26
export const MAX_ROW_LENGTH = 40

export interface LayoutCategory { name: string, rows: boolean[][] }
export type Layout = Record<CategoryKey, LayoutCategory>

export function fromScreenSeat (data: IScreenSeatRes): Layout {
  const toCategory = (category: IScreenSeatCategoryRes | undefined, fallback: string): LayoutCategory => ({
    name: category?.name ?? fallback,
    rows: Object.values(category?.seats ?? {}).map(row => (row ?? []).map(col => col !== 0))
  })
  return { diamond: toCategory(data.diamond, 'Diamond'), gold: toCategory(data.gold, 'Gold'), silver: toCategory(data.silver, 'Silver') }
}

/** Row letters run A, B, C… from the first diamond row to the last silver row */
export function rowLetters (layout: Layout): Record<CategoryKey, string[]> {
  let next = 0
  const letters = {} as Record<CategoryKey, string[]>
  for (const key of CATEGORY_KEYS) {
    letters[key] = layout[key].rows.map(() => String.fromCharCode(65 + next++))
  }
  return letters
}

/** Seat numbers for a row, counting seats left to right and skipping gaps (0 marks a gap) */
export function numberRow (row: boolean[]): ColNumType[] {
  let seat = 0
  return row.map(isSeat => (isSeat ? ++seat : 0) as ColNumType)
}

export function toScreenSeat (id: string, layout: Layout): IScreenSeatRes {
  const letters = rowLetters(layout)
  const toCategory = (key: CategoryKey): IScreenSeatCategoryRes => ({
    name: layout[key].name.trim() !== '' ? layout[key].name.trim() : key,
    seats: Object.fromEntries(layout[key].rows.map((row, i) => [letters[key][i], numberRow(row)]))
  })
  return { _id: id, diamond: toCategory('diamond'), gold: toCategory('gold'), silver: toCategory('silver') }
}

export function seatCount (layout: Layout): number {
  return CATEGORY_KEYS.reduce((sum, key) => sum + layout[key].rows.flat().filter(Boolean).length, 0)
}

export function totalRows (layout: Layout): number {
  return CATEGORY_KEYS.reduce((sum, key) => sum + layout[key].rows.length, 0)
}

function widest (layout: Layout): number {
  return Math.max(10, ...CATEGORY_KEYS.flatMap(key => layout[key].rows.map(row => row.length)))
}

function withCategory (layout: Layout, key: CategoryKey, change: (category: LayoutCategory) => LayoutCategory): Layout {
  return { ...layout, [key]: change(layout[key]) }
}

export function toggleSeat (layout: Layout, key: CategoryKey, rowIndex: number, colIndex: number): Layout {
  return withCategory(layout, key, category => ({
    ...category,
    rows: category.rows.map((row, r) => r !== rowIndex ? row : row.map((cell, c) => c === colIndex ? !cell : cell))
  }))
}

export function rename (layout: Layout, key: CategoryKey, name: string): Layout {
  return withCategory(layout, key, category => ({ ...category, name }))
}

/** Copies the category's last row (or a full row as wide as the widest one) below it */
export function addRow (layout: Layout, key: CategoryKey): Layout {
  if (totalRows(layout) >= MAX_ROWS) return layout
  return withCategory(layout, key, category => {
    const last = category.rows.at(-1)
    return { ...category, rows: [...category.rows, last !== undefined ? [...last] : Array<boolean>(widest(layout)).fill(true)] }
  })
}

export function removeRow (layout: Layout, key: CategoryKey): Layout {
  if (layout[key].rows.length === 0 || totalRows(layout) <= 1) return layout
  return withCategory(layout, key, category => ({ ...category, rows: category.rows.slice(0, -1) }))
}

/** Adds a column of seats at the end (or a gap at the start, to shift a block right) */
export function addColumn (layout: Layout, key: CategoryKey, at: 'start' | 'end'): Layout {
  return withCategory(layout, key, category => ({
    ...category,
    rows: category.rows.map(row => row.length >= MAX_ROW_LENGTH ? row : at === 'start' ? [false, ...row] : [...row, true])
  }))
}

export function removeColumn (layout: Layout, key: CategoryKey, at: 'start' | 'end'): Layout {
  return withCategory(layout, key, category => ({
    ...category,
    rows: category.rows.map(row => row.length <= 1 ? row : at === 'start' ? row.slice(1) : row.slice(0, -1))
  }))
}
