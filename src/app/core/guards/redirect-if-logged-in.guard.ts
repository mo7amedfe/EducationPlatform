import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);

  return _AuthService.isLogin$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        _Router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
}; 