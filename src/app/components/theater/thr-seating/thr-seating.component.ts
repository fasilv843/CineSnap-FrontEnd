/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ColNumType } from 'src/app/models/common'
import { IScreenSeatCategoryRes } from 'src/app/models/screenSeat'
import { ScreenSeatService } from 'src/app/services/screen-seat.service'
// import { ScreenService } from 'src/app/services/screen.service'

type SeatCategory = 'Diamond' | 'Gold' | 'Silver'

@Component({
  selector: 'app-thr-seating',
  templateUrl: './thr-seating.component.html',
  styleUrls: ['./thr-seating.component.css']
})
export class ThrSeatingComponent implements OnInit {
  seatId = ''
  editMode = false

  diamond: IScreenSeatCategoryRes = {
    name: 'Diamond',
    seats: {
      'A': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  }

  gold: IScreenSeatCategoryRes = {
    name: 'Gold',
    seats: {}
  }

  silver: IScreenSeatCategoryRes = {
    name: 'Silver',
    seats: {}
  }

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(ScreenSeatService) private readonly screenSeatService: ScreenSeatService
  ) { }

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.seatId = params['seatId']
    })

    this.screenSeatService.getScreenSeatData(this.seatId).subscribe({
      next: (res) => {
        console.log(res, 'res from get screen data')
        if (res.data === null) return
        this.seatId = res.data._id
        this.diamond = res.data.diamond
        this.gold = res.data.gold
        this.silver = res.data.silver
      }
    })
  }

  editScreenSeats (): void {
    if (!this.editMode) {
      this.editMode = true
    } else {
      this.editMode = false
    }
  }

  // Completed
  addDummySeatsAt (at: 'Start' | 'End', cat: IScreenSeatCategoryRes): void {
    for (const row of this.getRowKeys(cat)) {
      console.log(row, 'row that we got from getRowKeys()')
      // const seatsForRow = cat.seats[row] as ColNumType[]
      console.log(row, cat.seats[row], cat.seats[row]?.length, 'seatsForRow before adding')

      if (at === 'Start') {
        cat.seats[row]?.unshift(0)
      } else {
        console.log('adding to row', row)
        cat.seats[row]?.push(0)
      }
      // cat.seats[row] = seatsForRow
      console.log(row, cat.seats[row], cat.seats[row]?.length, 'seatsForRow after adding')
    }
  }

  // Completed
  // converts dummy seat to original
  addSeat (row: string, index: number, cat: IScreenSeatCategoryRes): void {
    let lastcol = 0
    cat.seats[row] = cat.seats[row]?.map((x, i) => {
      if (x > lastcol) lastcol = x

      if (i < index || (x === 0 && i !== index)) return x
      if (x === 0 && i === index) return ++lastcol as ColNumType
      return ++lastcol as ColNumType
    })
  }

  // Completed
  // converts original seat to dummy
  removeSeat (row: string, index: number, cat: IScreenSeatCategoryRes): void {
    cat.seats[row] = cat.seats[row]?.map((x, i) => {
      if (i < index || x === 0) return x
      if (i === index) return 0
      return x - 1 as ColNumType
    })
  }

  // Completed
  deleteColumn (category: SeatCategory): void {
    for (const row of Object.keys(this.diamond.seats)) {
      const seatsForRow = this.diamond.seats[row] as ColNumType[] | null
      if (seatsForRow != null) seatsForRow.pop()
    }
  }

  // Completed
  addRow (category: SeatCategory): void {
    const diamondKeys = this.getRowKeys(this.diamond)
    const goldKeys = this.getRowKeys(this.gold)
    const silverKeys = this.getRowKeys(this.silver)

    console.log('keys', diamondKeys, goldKeys, silverKeys)

    let lastKey: string
    if (silverKeys.length !== 0) {
      lastKey = silverKeys[silverKeys.length - 1]
    } else if (goldKeys.length !== 0) {
      lastKey = goldKeys[goldKeys.length - 1]
    } else {
      lastKey = diamondKeys[diamondKeys.length - 1]
    }

    console.log('lastKey', lastKey)

    if (lastKey !== 'Z') {
      if (category === 'Diamond') {
        console.log('adding row to diamond')

        const lastDiamondKey = diamondKeys[diamondKeys.length - 1]
        const lastRow = this.diamond.seats[lastDiamondKey]
        const nextKey = this.getNextChar(lastDiamondKey)
        this.diamond.seats[nextKey] = (lastRow !== undefined || lastRow != null) ? [...lastRow] : []
        console.log(nextKey, lastRow, 'new added row')

        this.updateRows(this.gold, 1)
        this.updateRows(this.silver, 1)
      } else if (category === 'Gold' && goldKeys.length !== 0) {
        const lastGoldKey = goldKeys[goldKeys.length - 1]
        const lastRow = this.gold.seats[lastGoldKey]
        const nextKey = this.getNextChar(lastGoldKey)
        this.gold.seats[nextKey] = (lastRow !== undefined || lastRow != null) ? [...lastRow] : []
        this.updateRows(this.silver, 1)
      } else if (category === 'Silver') {
        const lastSilverKey = silverKeys[silverKeys.length - 1]
        const lastRow = this.silver.seats[lastSilverKey]
        const nextKey = this.getNextChar(lastSilverKey)
        this.silver.seats[nextKey] = (lastRow !== undefined || lastRow != null) ? [...lastRow] : []
      }
    }
  }

  // Completed
  deleteRow (category: SeatCategory): void {
    const diamondKeys = this.getRowKeys(this.diamond)
    const goldKeys = this.getRowKeys(this.gold)
    const silverKeys = this.getRowKeys(this.silver)
    let lastKey: string
    if (silverKeys.length !== 0) {
      lastKey = silverKeys[silverKeys.length - 1]
    } else if (goldKeys.length !== 0) {
      lastKey = goldKeys[goldKeys.length - 1]
    } else {
      lastKey = diamondKeys[diamondKeys.length - 1]
    }
    if (lastKey !== 'A') {
      if (category === 'Diamond') {
        const lastDiamondKey = diamondKeys[diamondKeys.length - 1]
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.diamond.seats[lastDiamondKey]
        this.updateRows(this.gold, -1)
        this.updateRows(this.silver, -1)
      } else if (category === 'Gold') {
        const lastGoldKey = goldKeys[goldKeys.length - 1]
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.gold.seats[lastGoldKey]
        console.log('updating silver rows -1')
        this.updateRows(this.silver, -1)
      } else if (category === 'Silver') {
        const lastSilverKey = silverKeys[silverKeys.length - 1]
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.silver.seats[lastSilverKey]
      }
    }
  }

  // Completed
  getRowKeys (category: IScreenSeatCategoryRes): string[] {
    return Object.keys(category.seats)
  }

  // Completed
  updateRows (cat: IScreenSeatCategoryRes, value: 1 | -1): void {
    const rowKeys = this.getRowKeys(cat)
    console.log(rowKeys, 'rowKeys array')
    if (rowKeys.length === 0) return

    if (value === 1) {
      for (const row of rowKeys) {
        const rowAddress = cat.seats[row]
        if (rowAddress !== undefined) cat.seats[this.getNextChar(row)] = rowAddress.concat([])
      }
      const firstRow = rowKeys[0]
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete cat.seats[firstRow]
    } else {
      for (const row of rowKeys) {
        cat.seats[this.getPrevChar(row)] = cat.seats[row]?.concat([])
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete cat.seats[row]
      }
    }
  }

  getPrevChar (row: string): string {
    return String.fromCharCode(row.charCodeAt(0) - 1)
  }

  getNextChar (row: string): string {
    return String.fromCharCode(row.charCodeAt(0) + 1)
  }
}
