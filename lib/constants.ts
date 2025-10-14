export const authenticatedPaths = [
  '/home',
  '/notifications',
  '/assets',
  '/channels',
  '/analytics',
  '/profile',
  '/profile/creator',
  '/profile/fan',
  '/subscriptions',
  '/subscriptions/plan',
  '/cards',
  '/more'
];

export enum FetchMethods {
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH',
  GET = 'GET'
}

export enum AuthErrors {
  EMAIL_EXISTS = 'Email already exists. Please use another email.',
  INVALID_CREDENTIALS = 'Invalid email or password.',
  USER_NOT_FOUND = 'No user found with this email.',
  OFFLINE = 'You are offline. Please check your internet connection.',
  CREATOR_SIGNUP_FAILED = 'Unable to create creator account. Try again later.',
  FAN_SIGNUP_FAILED = 'Unable to create fan account. Try again later.',
  ADMIN_SIGNUP_FAILED = 'Unauthorized admin signup attempt.'
}

export const authCookieKey = '_accessToken';
export const authRefreshCookieKey = '_refreshToken';

export enum UserRoles {
  FAN = 'fan',
  ADMIN = 'admin',
  SUPER_VIEWER = 'super_viewer',
  CREATOR = 'creator'
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  fullName: string;
}

export const THEME = '_theme';

export enum AppSizes {
  ICON_1024 = '1024',
  ICON_512 = '512',
  ICON_384 = '384',
  ICON_256 = '256',
  ICON_196 = '196',
  ICON_144 = '144',
  ICON_96 = '96',
  ICON_72 = '72',
  ICON_48 = '48',
  ICON_36 = '36'
}

export enum AuthPaths {
  SIGNUP = '/signup',
  LOGIN = '/login',
  CREATOR_SIGNUP = '/creator-signup',
  FORGOT_PASSWORD = '/forgot-password',
  GOOGLE_LOGIN = '/google',
  APPLE_LOGIN = '/apple',
  META_LOGIN = '/meta'
}

export interface CreatorSignupInput {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_LOGIN = 'email_login'
}

export interface JwtUser {
  sub: string; // holds userId
  jti: string; // JWT ID
  iat: number; // issued at
  exp: number; // expiration time
  version: string;
  type: TokenType;
  roles: UserRoles[];
  ip: string;
  userAgent: string;
  associated_access_token_jti: string;
}
