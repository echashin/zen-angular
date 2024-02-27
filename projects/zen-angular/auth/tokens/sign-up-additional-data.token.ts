import { InjectionToken } from '@angular/core';

export const SIGN_UP_ADDITIONAL_DATA: InjectionToken<object> = new InjectionToken<object>('SIGN_UP_ADDITIONAL_DATA', {
  factory: () => ({}),
});
