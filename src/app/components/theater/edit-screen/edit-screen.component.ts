import { Component, Inject } from '@angular/core'
import { type FormGroup, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type IScreen, type IScreenRequirements } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
import { rowValidators, colValidators, defaultPriceValidators, screenNameValidators } from 'src/app/shared/valiators'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-edit-screen',
  templateUrl: './edit-screen.component.html',
  styleUrls: ['./edit-screen.component.css']
})
export class EditScreenComponent {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  form!: FormGroup
  isSubmitted = false
  theaterId = ''
  screenId = ''
  screen?: IScreen

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(ScreenService) private readonly screenService: ScreenService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute
  ) {}

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      name: ['', [validateByTrimming(screenNameValidators)]],
      rows: ['', [validateByTrimming(rowValidators)]],
      cols: ['', [validateByTrimming(colValidators)]],
      defaultPrice: ['', [validateByTrimming(defaultPriceValidators)]]
    })

    this.theaterDetails$.subscribe({
      next: (theater) => {
        console.log(this.theaterId, 'theaterId from store')
        this.theaterId = theater?._id as string
      }
    })

    this.route.params.subscribe(params => {
      this.screenId = params['screenId']
      console.log(this.screenId, 'screenId from route.params in ngOnInit')
    })

    this.screenService.getScreenData(this.screenId).subscribe({
      next: (res) => {
        this.screen = res.data ?? this.screen
        console.log(this.screen, 'screen data on ngOnInit')
        if (this.screen !== null && this.screen !== undefined) {
          this.form.get('name')?.setValue(this.screen.name)
          this.form.get('rows')?.setValue(this.screen.row)
          this.form.get('cols')?.setValue(String(this.screen.col))
          this.form.get('defaultPrice')?.setValue(String(this.screen.defaultPrice))
        }
      }
    })
  }

  updateScreen (): void {
    this.isSubmitted = true
    if (this.form.valid) {
      const formData = this.form.getRawValue()

      const screen: IScreenRequirements = {
        theaterId: this.theaterId,
        name: formData.name,
        row: formData.rows,
        col: Number(formData.cols),
        defaultPrice: Number(formData.defaultPrice)
      }

      this.screenService.editScreen(screen, this.screenId).subscribe({
        next: (res) => {
          void this.router.navigate(['/theater/screens'])
        }
      })
    }
  }
}
