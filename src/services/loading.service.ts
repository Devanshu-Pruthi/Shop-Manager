import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private activeRequests = 0;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<{ message: string } | null>(null);

    getLoading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    getError(): Observable<{ message: string } | null> {
        return this.errorSubject.asObservable();
    }

    showLoader(): void {
        this.activeRequests++;
        this.loadingSubject.next(true);
        // Clear error when a new request starts
        if (this.activeRequests === 1) {
            this.errorSubject.next(null);
        }
    }

    hideLoader(): void {
        this.activeRequests--;
        if (this.activeRequests <= 0) {
            this.activeRequests = 0;
            this.loadingSubject.next(false);
        }
    }

    showError(message: string): void {
        this.errorSubject.next({ message });
        this.hideLoader(); // Ensure loader stops on error
    }

    clearError(): void {
        this.errorSubject.next(null);
    }
}
