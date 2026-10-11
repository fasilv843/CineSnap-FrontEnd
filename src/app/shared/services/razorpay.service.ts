import { Injectable } from '@angular/core'
import { environments } from 'src/environments/environment'
import { type IRazorpayRes } from '../../core/models/api.model'

export interface IPayer {
  name: string
  email: string
  mobile: string
}

// Loaded from checkout.razorpay.com in index.html
declare const Razorpay: new (options: Record<string, unknown>) => { open: () => void }

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  /**
   * Opens Razorpay checkout for one payment.
   * Resolves with the payment response, or null when the payer closes the checkout without paying.
   */
  async pay (amount: number, payer: IPayer, description = 'Payment for booking a movie'): Promise<IRazorpayRes | null> {
    return await new Promise(resolve => {
      const checkout = new Razorpay({
        key: environments.razorpayPublicKey,
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        name: 'CineSnap',
        description,
        image: 'assets/logo-1x1.png',
        prefill: { name: payer.name, email: payer.email, contact: payer.mobile },
        notes: { address: 'CineSnap Private Limited' },
        theme: { color: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() },
        // Callers set signals from the result, which schedules rendering (the app is zoneless)
        handler: (response: IRazorpayRes) => { resolve(response) },
        modal: { ondismiss: () => { resolve(null) } }
      })
      checkout.open()
    })
  }
}
