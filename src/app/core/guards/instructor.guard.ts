import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, combineLatest } from 'rxjs/operators';
import { combineLatest as combineLatestOp } from 'rxjs';

export const instructorGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);

  return combineLatestOp([_AuthService.isInstructor$, _AuthService.isAdmin$]).pipe(
    map(([isInstructor, isAdmin]) => {
      if (isInstructor || isAdmin) {
        return true;
      } else {
        _Router.navigate(['/']);
        return false;
      }
    })
  );
}; 