import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (typeof window === 'undefined') {
    return true; // Allow access on the server to prevent SSR issues
  }
  
  // const isAuthenticated = !!localStorage.getItem('token');  authService.getToken();
  const isAuthenticated = !!authService.getToken();
  console.log(isAuthenticated)

  const result: any = isAuthenticated ? true : router.createUrlTree(['/app/home']);
  return result;
};


