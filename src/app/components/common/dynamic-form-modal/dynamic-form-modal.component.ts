// import { CommonModule } from '@angular/common'
// import { Component, Inject, Injector, Input, type OnInit } from '@angular/core'
// import { FormBuilder, type FormGroup, ReactiveFormsModule } from '@angular/forms'
// import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'

// @Component({
//   standalone: true,
//   imports: [
//     CommonModule,
//     NgbModalModule,
//     ReactiveFormsModule
//   ],
//   selector: 'app-dynamic-form-modal',
//   templateUrl: './dynamic-form-modal.component.html',
//   styleUrls: ['./dynamic-form-modal.component.css']
// })
// export class DynamicFormModalComponent implements OnInit {
//   @Input() modalTitle: string = 'Form'
//   @Input() submitBtn: string = 'Submit'
//   @Input() fields: any[] = []

//   form: FormGroup
//   // validationInjector: Injector
//   isSubmitted = false

//   constructor (
//     @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
//     @Inject(Injector) private readonly injector: Injector,
//     @Inject(NgbActiveModal) public activeModal: NgbActiveModal
//   ) {
//     this.form = this.formBuilder.group({})
//     // this.validationInjector = Injector.create({ providers: [{ provide: 'validationData', useValue: data }], parent: this.injector })
//   }

//   ngOnInit (): void {
//     // this.fields.forEach((field) => {
//     //   // const validators = this.validationFunctions[field.validationControl];
//     //   this.form.addControl(field.name, this.formBuilder.control('', field.validators))
//     // })

//     // this.setupFieldsArray()
//   }

//   setData (data: any): void {
//     this.form.patchValue(data)
//   }

//   onSubmit (): void {
//     this.isSubmitted = true
//     if (this.form.valid) {
//       const formData = this.form.value
//       this.activeModal.close(formData)
//     } else {
//       console.log('form is invalid', this.form)
//     }
//   }

//   // private setupFieldsArray (): void {
//   //   this.fields.forEach((field) => {
//   //     field.validationDataFn = this.createValidationDataFn(field.name)
//   //     // Add other field setup logic
//   //   })
//   // }

//   // private createValidationDataFn (controlName: string): () => any {
//   //   return () => ({
//   //     nameControl: this.form.get(controlName),
//   //     isSubmitted: this.isSubmitted
//   //   })
//   // }

//   onCancel (): void {
//     this.activeModal.dismiss('cancelled')
//   }
// }
