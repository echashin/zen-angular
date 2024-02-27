export interface AuthModuleOptions {
  authPageUrl: string;
  homePageUrl: string;
  urls: AuthUrlsConfig;
  signInAdditional?: { factory: (...args: any) => object; inject?: any[] };
  signUpAdditional?: { factory: (...args: any) => object; inject?: any[] };
  refreshAdditional?: { factory: (...args: any) => object; inject?: any[] };
}

export interface AuthUrlsConfig {
  apiDomain: string;
  signInUrl?: string;
  phoneSignInUrl?: string;
  signUpUrl?: string;
  refreshUrl?: string;
  permissionsUrl?: string[];
}
