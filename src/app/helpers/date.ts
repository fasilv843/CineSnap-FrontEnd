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
