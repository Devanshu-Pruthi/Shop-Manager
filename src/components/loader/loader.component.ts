import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Global Spinner -->
    <div *ngIf="isLoading$ | async" class="loader-overlay">
      <div class="loader-content">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>

    <!-- Fallback/Error Screen -->
    <div *ngIf="error$ | async as error" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{{ error.message }}</p>
        <button (click)="retry()" class="retry-btn">Close & Retry</button>
      </div>
    </div>
  `,
    styles: [`
    .loader-overlay, .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loader-content, .error-content {
      text-align: center;
      padding: 30px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      max-width: 400px;
      width: 90%;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #edf2f7;
      border-top: 5px solid #3182ce;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    h3 {
      color: #2d3748;
      margin-bottom: 10px;
    }

    p {
      color: #718096;
      margin-bottom: 20px;
    }

    .retry-btn {
      background: #3182ce;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .retry-btn:hover {
      background: #2b6cb0;
    }
  `]
})
export class LoaderComponent {
    isLoading$ = this.loadingService.getLoading();
    error$ = this.loadingService.getError();

    constructor(private loadingService: LoadingService) { }

    retry(): void {
        this.loadingService.clearError();
    }
}
