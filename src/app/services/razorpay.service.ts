/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core'
import { environments } from 'src/environments/environment';
import { type IRazorpayRes } from '../models/common';
import { type Observable, Subject } from 'rxjs';

interface IUserPayment {
  name: string
  email: string
  mobile: string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var Razorpay: any

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private readonly options: any;
  private readonly paymentResultSubject = new Subject<IRazorpayRes | null>();

  constructor () {
    this.options = {
      "key": environments.razorpayPublicKey,
      "amount": 1000000000, // amount in paise (Rupees x 100)
      "currency": 'INR',
      "name": 'CineSnap',
      "description": 'Payment for Booking Movie',
      "image": '../../../assets/logo-1x1.png',
      "order_id": '', // Replace with your order ID
      "handler": (response: IRazorpayRes) => { this.paymentResultSubject.next(response); },
      "prefill": {
        "name": '',
        "email": '',
        "contact": ''
      },
      "notes": {
        "address": 'CineSnap Private Limited'
      },
      "theme": {
        "color": '#f2bd00'
      }
    }
  }

  getPaymentResultObservable (): Observable<null | IRazorpayRes> {
    return this.paymentResultSubject.asObservable();
  }

  initiateRazorpayPayment (amount: number, user: IUserPayment): void {
    console.log('Initiating Razorpay payment');

    this.options.prefill.name = user.name;
    this.options.prefill.email = user.email;
    this.options.prefill.contact = user.mobile;
    this.options.amount = amount * 100;

    const rzp = new Razorpay(this.options);
    rzp.open();
  }
}
