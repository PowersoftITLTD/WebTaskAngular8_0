import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectToken } from '../../store/auth/auth.selectors';


import { Store } from '@ngrx/store'; 
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

// Helper function to check if a user is authenticated
const isAuthenticated = (store: Store): Observable<boolean> => {
  return store.select(selectToken).pipe(
    take(1), // Ensure we only take the first emitted value
    map((token) => !!token) 
  );
};

// Authenticated Routes
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return isAuthenticated(store).pipe(
    
    map((isLogedIn) => {
      if (!isLogedIn) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return isLogedIn;
    })
  );
};

// Non-Authenticated Routes
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return isAuthenticated(store).pipe(
    map((isLogedIn) => {
      if (isLogedIn) {
        router.navigate(['tasks']);
      }
      return !isLogedIn;
    })
  );
};