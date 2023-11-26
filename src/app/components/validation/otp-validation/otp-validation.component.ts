import { Component, EventEmitter, Input, Output } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
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
