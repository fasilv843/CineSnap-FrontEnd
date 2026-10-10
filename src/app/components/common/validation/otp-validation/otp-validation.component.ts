
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-otp-validation',
    imports: [],
    templateUrl: './otp-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./otp-validation.component.css']
})
export class OtpValidationComponent {
  @Input() otpControl: AbstractControl | null = null
  @Input() timerStr = '03:00'
  @Input() showOTPResend = false
  @Output() OTPResend = new EventEmitter()

  resendOTP (): void {
    this.OTPResend.emit()
  }
}
