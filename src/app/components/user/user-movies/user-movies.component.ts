import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { langType } from 'src/app/models/filter';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css'],
  providers: [DataServiceService]
})
export class UserMoviesComponent implements OnInit {
  genreId: number | undefined
  langAbbr: langType | undefined
  constructor (
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit (): void {
    this.route.queryParamMap.subscribe(params => {
      const genreIdStr = params.get('genreId')
      if (genreIdStr !== null) this.genreId = parseInt(genreIdStr)
      const lang = params.get('langAbbr') as langType | null
      if (lang !== null) this.langAbbr = lang
    })
  }
}
