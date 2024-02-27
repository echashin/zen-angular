import {NgIf} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EnvironmentProviders, ModuleWithProviders, NgModule, Provider} from '@angular/core';

import {AclButtonDirective, AclLinkDirective} from './directives';
import {AuthInterceptor} from './interceptors';
import {AuthModuleOptions} from './interfaces';
import {AclService, AuthService} from './services';
import {
  API_DOMAIN,
  AUTH_PAGE_URL,
  HOME_PAGE_URL,
  PERMISSIONS_URL,
  PHONE_SIGN_IN_URL,
  REFRESH_ADDITIONAL_DATA,
  REFRESH_URL,
  SIGN_IN_ADDITIONAL_DATA,
  SIGN_IN_URL,
  SIGN_UP_ADDITIONAL_DATA,
  SIGN_UP_URL
} from './tokens';
import {AclHasAccessPipe} from "./pipes";
import {NzNotificationModule} from "ng-zorro-antd/notification";

@NgModule({
  declarations: [AclButtonDirective, AclLinkDirective, AclHasAccessPipe],
  imports: [
    HttpClientModule,
    NgIf,
    NzNotificationModule,
  ],
  providers: [AuthService, AclService],
  exports: [AclButtonDirective, AclLinkDirective, AclHasAccessPipe],
})
export class ZenAuthModule {
  static forRoot(options: AuthModuleOptions): ModuleWithProviders<ZenAuthModule> {
    const providers: Array<Provider | EnvironmentProviders> = [];

    if (options.signInAdditional) {
      providers.push({
        provide: SIGN_IN_ADDITIONAL_DATA,
        useFactory: options.signInAdditional.factory,
        deps: options.signInAdditional.inject,
      });
    }

    if (options.signUpAdditional) {
      providers.push({
        provide: SIGN_UP_ADDITIONAL_DATA,
        useFactory: options.signUpAdditional.factory,
        deps: options.signUpAdditional.inject,
      });
    }

    if (options.refreshAdditional) {
      providers.push({
        provide: REFRESH_ADDITIONAL_DATA,
        useFactory: options.refreshAdditional.factory,
        deps: options.refreshAdditional.inject,
      });
    }

    if (options.urls.signInUrl) {
      providers.push({
        provide: SIGN_IN_URL,
        useValue: options.urls.signInUrl,
      });
    }

    if (options.urls.phoneSignInUrl) {
      providers.push({
        provide: PHONE_SIGN_IN_URL,
        useValue: options.urls.phoneSignInUrl,
      });
    }

    if (options.urls.permissionsUrl) {
      providers.push({
        provide: PERMISSIONS_URL,
        useValue: options.urls.permissionsUrl,
      });
    }

    if (options.urls.signUpUrl) {
      providers.push({
        provide: SIGN_UP_URL,
        useValue: options.urls.signUpUrl,
      });
    }

    if (options.urls.refreshUrl) {
      providers.push({
        provide: REFRESH_URL,
        useValue: options.urls.refreshUrl,
      });
    }

    return {
      ngModule: ZenAuthModule,
      providers: [
        ...providers,
        {
          provide: AUTH_PAGE_URL,
          useValue: options.authPageUrl,
        },
        {
          provide: HOME_PAGE_URL,
          useValue: options.homePageUrl,
        },
        {
          provide: API_DOMAIN,
          useValue: options.urls.apiDomain,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    };
  }
}
