import { Component, Inject } from '@angular/core'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-thr-profile',
  templateUrl: './thr-profile.component.html',
  styleUrls: ['./thr-profile.component.css']
})
export class ThrProfileComponent {
  // userDetails$ = this.store.pipe(select(selectUserDetails))
  name: string = ''
  email: string = ''
  dob!: Date
  mobile!: number
  profilePic!: string
  city!: string
  state!: string
  district!: string
  country!: string
  zip!: number
  wallet!: number
  editMode: boolean = false

  constructor (
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    // this.userDetails$.subscribe((user) => {
    //   this.name = user?.name ?? '';
    //   this.email = user?.email ?? '';
    //   this.dob = user?.dob ?? new Date('1990-01-01');
    //   this.mobile = user?.mobile ?? 0
    //   this.profilePic = user?.profilePic ?? ''
    //   this.city = user?.address?.city ?? ''
    //   this.state = user?.address?.state ?? ''
    //   this.district = user?.address?.district ?? ''
    //   this.country = user?.address?.country ?? ''
    //   this.zip = user?.address?.zip ?? 0
    //   this.wallet = user?.wallet ?? 0
    // })
  }

  toggleEditMode (): void {
    this.editMode = !this.editMode
  }
}
