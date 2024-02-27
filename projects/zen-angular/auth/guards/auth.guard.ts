import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AUTH_PAGE_URL } from '../tokens';
import Cookies from "js-cookie";

export const AuthGuard: CanActivateFn = (): boolean => {
  const router: Router = inject(Router);
  const authUrl: string = inject(AUTH_PAGE_URL);
  const tokenExist: string = Cookies.get('accessToken') ?? Cookies.get('refreshToken') ?? '';
  if (!tokenExist) {
    router.navigate([authUrl]).then();
    return false;
  }
  return true;
};
