import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_DOMAIN, REFRESH_URL, SIGN_IN_URL, PHONE_SIGN_IN_URL, SIGN_UP_URL } from '../tokens';
import { PhoneSignInInput, RefreshTokenInput, SignInInput, SignUpInput, Tokens } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRequestsService extends ApiService {
  constructor(
    override readonly http: HttpClient,
    @Inject(SIGN_IN_URL) private readonly signInUrl: string,
    @Inject(PHONE_SIGN_IN_URL) private readonly phoneSignInUrl: string,
    @Inject(SIGN_UP_URL) private readonly signUpUrl: string,
    @Inject(REFRESH_URL) private readonly refreshUrl: string,
    @Inject(API_DOMAIN) private readonly domain: string,
  ) {
    super(http);
    this.url = this.domain;
  }

  signIn = (data: SignInInput): Observable<Tokens> => this.request<Tokens, SignInInput>(this.signInUrl, 'POST', data);
  phoneSignIn = (data: PhoneSignInInput): Observable<Tokens> => this.request<Tokens, PhoneSignInInput>(this.phoneSignInUrl, 'POST', data);
  signUp = (data: SignUpInput): Observable<Tokens> => this.request<Tokens, SignUpInput>(this.signUpUrl, 'POST', data);
  refresh = (data: RefreshTokenInput): Observable<Tokens> => this.request<Tokens, RefreshTokenInput>(this.refreshUrl, 'POST', data);
}
