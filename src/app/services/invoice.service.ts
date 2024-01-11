import { Injectable } from '@angular/core'
import html2canvas from 'html2canvas'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  async generateInvoice (ticketDetails: any): Promise<string> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)) // delaying for 1 second
      const invoiceElement = document.getElementById('invoice-container')
      if (invoiceElement !== null) {
        const canvas = await html2canvas(invoiceElement)
        return canvas.toDataURL('image/png')
      } else {
        return ''
      }
    } catch (error) {
      console.error('Error generating invoice image:', error)
      return ''
    }
  }

  downloadInvoice (imageDataUrl: string): void {
    const a = document.createElement('a')
    a.href = imageDataUrl
    a.download = 'movie_ticket_invoice.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
