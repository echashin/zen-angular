import {Inject, Injectable} from '@angular/core';
import jwtDecode from 'jwt-decode';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {REFRESH_ADDITIONAL_DATA, SIGN_IN_ADDITIONAL_DATA, SIGN_UP_ADDITIONAL_DATA} from '../tokens';
import {RefreshTokenInput, SignInInput, SignUpInput, Tokens} from '../types';
import {AuthRequestsService} from './auth-requests.service';
import {TokensService} from './tokens.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    @Inject(SIGN_IN_ADDITIONAL_DATA) private readonly signInAdditional: object,
    @Inject(SIGN_UP_ADDITIONAL_DATA) private readonly signUpAdditional: object,
    @Inject(REFRESH_ADDITIONAL_DATA) private readonly refreshAdditional: object,
    private readonly authRequests: AuthRequestsService,
  ) {
  }

  signIn(input: any ): Observable<Tokens> {
    return this.authRequests.signIn({...input, ...this.signInAdditional}).pipe(
      tap((tokens: Tokens) => {
        this.setTokens(tokens);
      }),
    );
  }

  phoneSignIn(input: any ): Observable<Tokens> {
    return this.authRequests.phoneSignIn({...input, ...this.signInAdditional}).pipe(
      tap((tokens: Tokens) => {
        this.setTokens(tokens);
      }),
    );
  }

  signUp(input: any): Observable<Tokens> {
    return this.authRequests.signUp({...input, ...this.signUpAdditional})
      .pipe(
        tap((tokens: Tokens) => {
          this.setTokens(tokens);
        }),
      );
  }

  refresh(input: any): Observable<Tokens> {
    return this.authRequests.refresh({...input, ...this.refreshAdditional}).pipe(
      tap((tokens: Tokens) => {
        this.setTokens(tokens);
      }),
    );
  }

  private setTokens({refreshToken, accessToken}: Tokens): void {
    const accessDecode: Record<string, any> = jwtDecode(accessToken);
    this.tokensService.setAccessToken(accessToken, accessDecode['exp'] ? new Date(accessDecode['exp'] * 1000) : undefined);

    const refreshDecode: Record<string, any> = jwtDecode(refreshToken);
    this.tokensService.setRefreshToken(refreshToken, refreshDecode['exp'] ? new Date(refreshDecode['exp'] * 1000) : undefined);
  }
}
