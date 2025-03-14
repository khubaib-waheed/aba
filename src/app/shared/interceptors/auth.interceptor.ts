import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  let tokenUuid = authService.getToken() || ''; // Get API key if available
  
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: tokenUuid, // Set Token in headers
    },
  });

  return next(clonedRequest);
};
