import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type IScreenRequirements } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
import { colValidators, defaultPriceValidators, nameValidators, rowValidators } from 'src/app/shared/valiators'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.css']
})
export class AddScreenComponent implements OnInit {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  form!: FormGroup
  isSubmitted = false
  theaterId: string = ''

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(ScreenService) private readonly screenService: ScreenService
  ) {}

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      name: ['', [validateByTrimming(nameValidators)]],
      rows: ['', [validateByTrimming(rowValidators)]],
      cols: ['', [validateByTrimming(colValidators)]],
      defaultPrice: ['', [validateByTrimming(defaultPriceValidators)]]
    })

    this.theaterDetails$.subscribe({
      next: (theater) => {
        this.theaterId = theater?._id as string
      }
    })
  }

  saveScreen (): void {
    this.isSubmitted = true
    if (this.form.valid) {
      const formData = this.form.getRawValue()

      const screen: IScreenRequirements = {
        theaterId: this.theaterId,
        name: formData.name,
        row: formData.rows,
        col: Number(formData.cols),
        defaultPrice: formData.defaultPrice
      }

      this.screenService.addScreen(screen).subscribe({
        next: (res) => {
          void this.router.navigate(['/theater/screens'])
        }
      })
    }
  }
}
