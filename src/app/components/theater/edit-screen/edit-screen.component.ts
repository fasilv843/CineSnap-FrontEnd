import { Component } from '@angular/core'

@Component({
  selector: 'app-edit-screen',
  templateUrl: './edit-screen.component.html',
  styleUrls: ['./edit-screen.component.css']
})
export class EditScreenComponent {
  updateScreen (): void {
    console.log('update function invoked')
  }
}
