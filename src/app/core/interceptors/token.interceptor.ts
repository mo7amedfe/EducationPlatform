import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const _AuthService = inject(AuthService);
  const token = _AuthService.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned)
  }

  return next(req);
};
