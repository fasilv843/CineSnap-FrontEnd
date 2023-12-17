import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-container mt-3">
      <div class="film-reel-spinner"></div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
    }

    .film-reel-spinner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 5px solid #f2bd00;
      border-top: 5px solid transparent;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class SpinnerComponent {}
