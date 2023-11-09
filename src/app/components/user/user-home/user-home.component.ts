// import { type HttpClient } from '@angular/common/http';
import { Component, type OnInit } from '@angular/core'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
  ) {}

  ngOnInit (): void {
    const cookie = document.cookie
    console.log(cookie, 'cookie')
  }
}
