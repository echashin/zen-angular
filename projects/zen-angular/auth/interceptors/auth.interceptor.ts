import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ObservableInput, of, throwError} from 'rxjs';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';

import {AuthService, NavigationService, TokensService} from '../services';
import {AUTH_PAGE_URL, PHONE_SIGN_IN_URL, REFRESH_URL, SIGN_IN_URL, SIGN_UP_URL} from '../tokens';
import {Tokens} from '../types';
import {InputError} from "../interfaces";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  tokenUrls: string[];

  constructor(
    @Inject(SIGN_IN_URL) private readonly signInUrl: string,
    @Inject(PHONE_SIGN_IN_URL) private readonly phoneSignInUrl: string,
    @Inject(SIGN_UP_URL) private readonly signUpUrl: string,
    @Inject(REFRESH_URL) private readonly refreshUrl: string,
    @Inject(AUTH_PAGE_URL) private readonly authPageUrl: string[],
    private readonly tokensService: TokensService,
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
    private readonly notification: NzNotificationService,
  ) {
    this.tokenUrls = [this.signInUrl, this.phoneSignInUrl, this.signUpUrl, this.refreshUrl];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          if (error && error.status === HttpStatusCode.Unauthorized) {
            if (this.isGetTokenUrl(req.url)) {
              this.navigationService.goToAuthPage();
              this.notification.info('Session', 'The session has expired.', {
                nzDuration: 10000,
                nzPlacement: 'bottomLeft',
              })
              this.refreshTokenInProgress = false;
              return of();
            } else {
              if (this.refreshTokenInProgress) {
                return this.refreshTokenSubject.pipe(
                  filter((result: string | null): boolean => result !== null),
                  take(1),
                  switchMap(() => next.handle(this.addAuthenticationToken(req))),
                );
              } else {
                this.refreshTokenInProgress = true;
                this.refreshTokenSubject.next(null);

                return this.authService
                  .refresh({
                    refreshToken: this.tokensService.getRefreshToken() || '',
                  })
                  .pipe(
                    switchMap(({ refreshToken }: Tokens) => {
                      this.refreshTokenSubject.next(refreshToken);
                      return next.handle(this.addAuthenticationToken(req));
                    }),
                    finalize(() => (this.refreshTokenInProgress = false)),
                  );
              }
            }
          } else {
            return this.onCatchError(error);
          }
        },
      ),
    ) as Observable<HttpEvent<any>>;
  }

  private isGetTokenUrl(url: string): boolean {
    return this.tokenUrls.some((tokenRelativeUrl: string) => url.includes(tokenRelativeUrl));
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    return this.tokensService.getAccessToken()
      ? request.clone({
          headers: request.headers.set('Authorization', `Bearer ${this.tokensService.getAccessToken()}`),
        })
      : request;
  }

  private onCatchError(err: HttpErrorResponse): ObservableInput<any> {
    const notificationText: string =
      (err.status !== HttpStatusCode.BadRequest && err.status === HttpStatusCode.Unauthorized) || !Array.isArray(err.error.message)
        ? err.error.message
        : err.error.message.map(({ message, property }: InputError) => `${property}: ${message}`).join('\n');

    this.notification.create('error', 'Error', notificationText, {
      nzDuration: 10000,
      nzPlacement: 'bottomLeft',
    });

    return throwError(() => err);
  }
}
