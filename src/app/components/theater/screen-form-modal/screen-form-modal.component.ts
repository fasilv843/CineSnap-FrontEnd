/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationModule } from 'src/app/modules/validation/validation.module';
import { Store, select } from '@ngrx/store';
import { validateByTrimming } from 'src/app/helpers/validations';
import { colValidators, rowValidators, screenNameValidators } from 'src/app/shared/valiators';
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector';

@Component({
  selector: 'app-screen-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule,
    ValidationModule
  ],
  templateUrl: './screen-form-modal.component.html',
  styleUrls: ['./screen-form-modal.component.css']
})
export class ScreenFormModalComponent implements OnInit {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  screenForm!: FormGroup
  isSubmitted = false
  theaterId: string = ''

  modalTitle: string = ''
  submitBtn: string = ''

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(NgbActiveModal) public activeModal: NgbActiveModal,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    console.log('modal form is initializing')
    this.screenForm = this.formBuilder.group({
      name: ['', [validateByTrimming(screenNameValidators)]],
      rows: ['', [validateByTrimming(rowValidators)]],
      cols: ['', [validateByTrimming(colValidators)]]
    })

    this.theaterDetails$.subscribe(theater => {
      if (theater !== null) this.theaterId = theater._id
    })
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
