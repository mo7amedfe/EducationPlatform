import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const instructorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.role();

  if (role === 'Instructor' || role === 'Admin') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
