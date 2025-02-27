import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service.service';
import { map, catchError, of } from 'rxjs';

export const AuthGuardService: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let currentUser: any = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (state.url.startsWith('/admin')) {
    if (currentUser.role === 'admin') {
      return true;
    }
  } else if (state.url.startsWith('/teacher')) {
    if (currentUser.role === 'teacher') {
      return true;
    }
  } else if (state.url.startsWith('/student')) {
    if (currentUser.role === 'student') {
      return true;
    }
  }

  
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};