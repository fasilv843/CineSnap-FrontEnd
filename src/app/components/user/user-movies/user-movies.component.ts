/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
// import { ActivatedRoute } from '@angular/router'
// import { genreType, langType } from 'src/app/models/filter'

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css']
})
export class UserMoviesComponent implements OnInit {
  // filter!: langType | genreType

  // constructor (
  //   private readonly route: ActivatedRoute
  // ) {
  // }

  ngOnInit (): void {
    // this.route.params.subscribe(params => {
    //   this.filter = params['filter']
    //   console.error(this.filter, 'filter from route')
    // })
  }
}
