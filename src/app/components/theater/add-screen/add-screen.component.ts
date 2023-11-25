import { Component } from '@angular/core'

@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.css']
})
export class AddScreenComponent {
  name: string = ''
  rows: string = ''
  cols: number = 0
  defaultPrice: number = 100

  saveScreen (): void {

  }
}
