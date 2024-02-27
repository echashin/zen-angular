import { InjectionToken } from '@angular/core';

export const SIGN_IN_URL: InjectionToken<string> = new InjectionToken<string>('SIGN_IN_URL', {
  factory: () => 'sign-in',
});

export const PHONE_SIGN_IN_URL: InjectionToken<string> = new InjectionToken<string>('SIGN_IN_URL', {
  factory: () => 'phone-sign-in',
});

export const SIGN_UP_URL: InjectionToken<string> = new InjectionToken<string>('SIGN_UP_URL', {
  factory: () => 'sign-up',
});

export const REFRESH_URL: InjectionToken<string> = new InjectionToken<string>('REFRESH', {
  factory: () => 'refresh',
});

export const PERMISSIONS_URL: InjectionToken<string> = new InjectionToken<string>('PERMISSIONS', {
  factory: () => 'permissions',
});

export const AUTH_PAGE_URL: InjectionToken<string> = new InjectionToken<string>('AUTH_PAGE_URL', {
  factory: () => 'auth',
});

export const HOME_PAGE_URL: InjectionToken<string> = new InjectionToken<string>('HOME_PAGE_URL', {
  factory: () => 'home',
});

export const API_DOMAIN: InjectionToken<string> = new InjectionToken<string>('API_DOMAIN', {
  factory: () => '',
});
