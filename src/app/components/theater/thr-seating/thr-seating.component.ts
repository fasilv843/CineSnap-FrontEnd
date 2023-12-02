import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ScreenService } from 'src/app/services/screen.service'

@Component({
  selector: 'app-thr-seating',
  templateUrl: './thr-seating.component.html',
  styleUrls: ['./thr-seating.component.css']
})
export class ThrSeatingComponent implements OnInit {
  rows: string = 'A'
  cols: number = 1
  screenId = ''
  colsArr: number[] = []

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(ScreenService) private readonly screenService: ScreenService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.screenId = params['screenId']
    })

    this.screenService.getScreenData(this.screenId).subscribe({
      next: (res) => {
        if (res.data != null) {
          this.rows = res.data.row
          this.cols = res.data.col
          this.colsArr = Array(this.cols).fill(this.cols).map((_, index) => this.cols - index)
        }
      }
    })
  }

  getRowCharacters (): string[] {
    const startCharCode = 'A'.charCodeAt(0)
    const endCharCode = this.rows.charCodeAt(0)
    const rowCharacters = []

    for (let charCode = startCharCode; charCode <= endCharCode; charCode++) {
      rowCharacters.push(String.fromCharCode(charCode))
    }

    return rowCharacters
  }
}
