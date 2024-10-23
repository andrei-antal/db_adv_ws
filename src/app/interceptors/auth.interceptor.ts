import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${inject(AuthService).token()}`
    ),
  });
  return next(authReq);
};
