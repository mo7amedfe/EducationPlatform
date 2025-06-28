import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);

  return _AuthService.isAdmin$.pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true;
      } else {
        _Router.navigate(['/']);
        return false;
      }
    })
  );
}; 