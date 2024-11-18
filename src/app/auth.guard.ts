import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('idToken'); 

  if (isLoggedIn) {
    return true; 
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
