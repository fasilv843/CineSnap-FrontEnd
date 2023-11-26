import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup } from '@angular/forms'
import { validateByTrimming } from 'src/app/helpers/validations'
import { colValidators, defaultPriceValidators, nameValidators, rowValidators } from 'src/app/shared/valiators'

@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.css']
})
export class AddScreenComponent implements OnInit {
  form!: FormGroup
  isSubmitted = false

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      name: ['', [validateByTrimming(nameValidators)]],
      rows: ['', [validateByTrimming(rowValidators)]],
      cols: ['', [validateByTrimming(colValidators)]],
      defaultPrice: ['', [validateByTrimming(defaultPriceValidators)]]
    })
  }

  saveScreen (): void {
    this.isSubmitted = true
  }
}
