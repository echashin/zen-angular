import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AuthTokensService } from '../interfaces';
import { Tokens } from '../types';

@Injectable({
  providedIn: 'root',
})
export class TokensService implements AuthTokensService {
  private tokensUpdated: Subject<void> = new Subject();
  tokensUpdated$: Observable<void> = this.tokensUpdated.asObservable().pipe(debounceTime(500));

  getAccessToken(): string | undefined {
    return Cookies.get('accessToken');
  }

  setAccessToken(token: string, expiresAccessToken?: Date): void {
    Cookies.set('accessToken', token, { ...(expiresAccessToken && { expires: expiresAccessToken }) });
    this.tokensUpdated.next();
  }

  removeAccessToken(): void {
    Cookies.remove('accessToken');
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  }

  setRefreshToken(token: string, expiresRefreshToken?: Date): void {
    Cookies.set('refreshToken', token, { ...(expiresRefreshToken && { expires: expiresRefreshToken }) });
    this.tokensUpdated.next();
  }

  removeRefreshToken(): void {
    Cookies.remove('refreshToken');
  }

  setTokens(tokes: Tokens): void {
    this.setAccessToken(tokes.accessToken);
    this.setRefreshToken(tokes.refreshToken);
  }
}
