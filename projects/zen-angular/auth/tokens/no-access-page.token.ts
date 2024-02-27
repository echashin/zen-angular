import {InjectionToken} from "@angular/core";

export const NO_ACCESS_PAGE: InjectionToken<string> = new InjectionToken<string>('NO_ACCESS_PAGE', {
  factory: () => ''
})