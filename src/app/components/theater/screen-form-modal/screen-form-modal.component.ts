/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActiveModal } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store';
import { validateByTrimming } from 'src/app/helpers/validations';
import { colValidators, rowValidators, screenNameValidators } from 'src/app/shared/valiators';
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector';
import { ScreenNameValidationComponent } from './validation/screen-name-validation/screen-name-validation.component';
import { RowValidationComponent } from './validation/row-validation/row-validation.component';
import { ColValidationComponent } from './validation/col-validation/col-validation.component';

@Component({
    selector: 'app-screen-form-modal',
    imports: [
    ReactiveFormsModule,
    ScreenNameValidationComponent,
    RowValidationComponent,
    ColValidationComponent
],
    templateUrl: './screen-form-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./screen-form-modal.component.css']
})
export class ScreenFormModalComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  activeModal = inject(ActiveModal);
  private readonly store = inject(Store);

  theaterDetails = this.store.selectSignal(selectTheaterDetails)
  screenForm!: FormGroup
  isSubmitted = false
  theaterId: string = ''

  modalTitle: string = ''
  submitBtn: string = ''

  ngOnInit (): void {
    console.log('modal form is initializing')
    this.screenForm = this.formBuilder.group({
      name: ['', [validateByTrimming(screenNameValidators)]],
      rows: ['', [validateByTrimming(rowValidators)]],
      cols: ['', [validateByTrimming(colValidators)]]
    })

    const theater = this.theaterDetails()
    if (theater !== null) this.theaterId = theater._id
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.screenForm.valid) {
      const screenData = this.screenForm.value
      console.log(screenData, 'screen form data from modal')
      this.activeModal.close(screenData)
    } else {
      console.log('screenForm is invalid', this.screenForm.controls)
    }
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
