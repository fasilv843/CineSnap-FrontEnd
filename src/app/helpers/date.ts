export function dateToString (date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getDatesArray (): Date[] {
  const datesArray = []
  const today = new Date()

  for (let i = 0; i < 5; i++) {
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + i)
    datesArray.push(nextDate)
  }

  return datesArray
}

export function isToday (date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function isSameDay (date1: Date, date2: Date): boolean {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
