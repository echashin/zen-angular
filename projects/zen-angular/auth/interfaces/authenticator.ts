import { SignInInput, SignUpInput } from '../types';

export interface Authenticator {
  signIn(input: SignInInput): void;
  signUp(input: SignUpInput): void;
}
