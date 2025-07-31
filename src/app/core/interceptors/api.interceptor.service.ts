import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, switchMap, take } from 'rxjs/operators';

// Store
import { Store } from '@ngrx/store';

import _get from 'lodash/get';
import { AuthService } from '../../services/auth/auth.service';
import { selectToken } from '../../store/auth/auth.selectors';
import { NotificationService } from '../../services/notification.service';


@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);

  store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add headers

    return this.store.select(selectToken).pipe(
      take(1), // Complete the observable after the first emitted value
      switchMap((authToken) => {
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`),
        });

        return next.handle(modifiedReq);
      }),
      catchError((error) => this.errorHandler(error)),
    );
  }

  // Error Handling
  private errorHandler(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    const { status, message, url, error: apiError } = error;
    let errorMessage: string = _get(apiError?.Data, 'message', null);
    if (errorMessage === null) {
      errorMessage = _get(apiError, 'title', 'Something went wrong.');
    }
    if (status === 401) {
      // logout handling.
      this.authService.logout();
    }
    // show error toaster
    this.notificationService.error(errorMessage);
    return throwError(() => new Error(message));
  }
}
