import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { langType } from 'src/app/models/filter';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UserNavComponent } from '../user-nav/user-nav.component';
import { CsMoviesComponent } from '../../common/cs-movies/cs-movies.component';

@Component({
    selector: 'app-user-movies',
    templateUrl: './user-movies.component.html',
    styleUrls: ['./user-movies.component.css'],
    providers: [DataServiceService],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserNavComponent, CsMoviesComponent]
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
