import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';

import {NO_ACCESS_PAGE} from '../tokens';
import {map} from "rxjs/operators";
import {AclService} from "../services";

export const AclPagesGuard: (resourcePath: string) => CanActivateFn = (resourcePath: string): CanActivateFn => {
  return (): ReturnType<CanActivateFn> => {
    const router: Router = inject(Router);
    const noAccessPage: string = inject(NO_ACCESS_PAGE);
    const aclService: AclService = inject(AclService);
    return aclService.permissions
      .pipe(
        map((): boolean | UrlTree => {
          if (aclService.isAvailable(resourcePath)) {
            return true;
          }
          return router.parseUrl(noAccessPage);
        })
      )
  };
};
