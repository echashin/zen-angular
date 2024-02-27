export interface SessionOutInput {
  sessionId: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface PhoneSignInInput {
  fullPhoneNumber: string;
  password: string;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface EmailVerifyInput {
  code: string;
}

export interface ResetPasswordInput {
  email: string;
  deviceId: string;
}

export interface SetPasswordInput {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface decodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
