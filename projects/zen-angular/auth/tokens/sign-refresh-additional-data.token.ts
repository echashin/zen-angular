import { InjectionToken } from '@angular/core';

export const REFRESH_ADDITIONAL_DATA: InjectionToken<object> = new InjectionToken<object>('REFRESH_ADDITIONAL_DATA', {
  factory: () => ({}),
});
