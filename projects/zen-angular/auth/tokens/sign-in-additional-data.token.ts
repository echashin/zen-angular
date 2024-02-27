import { InjectionToken } from '@angular/core';

export const SIGN_IN_ADDITIONAL_DATA: InjectionToken<object> = new InjectionToken<object>('SIGN_IN_ADDITIONAL_DATA', {
  factory: () => ({}),
});
