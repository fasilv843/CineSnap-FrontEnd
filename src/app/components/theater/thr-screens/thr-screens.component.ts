import { Component, Inject, type OnInit } from '@angular/core'
import { type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
// import { ShowScreenComponent } from '../show-screen/show-screen.component'
// import { AddScreenComponent } from '../add-screen/add-screen.component'
// import { EditScreenComponent } from '../edit-screen/edit-screen.component'

@Component({
  selector: 'app-thr-screens',
  templateUrl: './thr-screens.component.html',
  styleUrls: ['./thr-screens.component.css']
})
export class ThrScreensComponent implements OnInit {
  screens: IScreen[] = []

  constructor (
    @Inject(ScreenService) private readonly screenService: ScreenService
  ) {}

  ngOnInit (): void {
    const id = '6561831a108f68a8ec82be6b'
    this.screenService.findScreens(id).subscribe({
      next: (res: IApiScreensRes) => {
        this.screens = res.data
      }
    }) /// store theaterId on state
  }

  deleteScreen (): void {
    console.log('delete screen')
  }

  editScreen (): void {
    console.log(' edit screen')
  }
}
