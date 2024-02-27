import { Observable } from 'rxjs';

import { Tokens } from '../types';

export interface AuthTokensService {
  tokensUpdated$: Observable<void>;

  getAccessToken(): string | undefined;
  setAccessToken(token: string): void;
  removeAccessToken(): void;

  getRefreshToken(): string | undefined;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;

  setTokens(tokes: Tokens): void;
}
