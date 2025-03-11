import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (typeof window === 'undefined') {
    return true; // Allow access on the server to prevent SSR issues
  }

  // localStorage.setItem('token', 'fdsfdsfds')
  
  const isAuthenticated = !!localStorage.getItem('token');

  const result: any = isAuthenticated ? true : router.createUrlTree(['/auth/sign-in']);
  return result;
};


