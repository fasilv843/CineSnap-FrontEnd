import { Component } from '@angular/core'
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css'],
  providers: [DataServiceService]
})
export class UserMoviesComponent {}
