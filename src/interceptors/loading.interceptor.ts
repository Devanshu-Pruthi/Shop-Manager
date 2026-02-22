import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    const toastService = inject(ToastService);

    loadingService.showLoader();

    const userId = localStorage.getItem('userId');
    let authReq = req;

    if (userId) {
        authReq = req.clone({
            setHeaders: {
                'x-user-id': userId
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Something went wrong. Please try again later.';
            if (error.status === 0) {
                errorMessage = 'Network error. Please check if the server is running.';
            } else if (error.error?.message) {
                errorMessage = error.error.message;
            }
            loadingService.showError(errorMessage);
            toastService.error(errorMessage);
            return throwError(() => error);
        }),
        finalize(() => {
            loadingService.hideLoader();
        })
    );
};
