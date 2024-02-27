import {InjectionToken} from "@angular/core";

export const ACCESS_SEPARATOR: InjectionToken<string> = new InjectionToken<string>('ACCESS_SEPARATOR', {
  factory: () => ':'
})