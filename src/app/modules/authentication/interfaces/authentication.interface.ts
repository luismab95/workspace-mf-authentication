export interface LoginI {
  type: UserType;
  email: string;
  password: string;
}

export type UserType = 'L' | 'G';

export interface UserI {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  type: UserType;
}

export interface ResendOtpI {
  email: string;
  type: OtpUserType;
}

export type OtpUserType = 'L' | 'R';

export interface LoginOtpI {
  email: string;
  otp: string;
  ipAddress?: string;
  information?: string;
}

export interface LoginResponseI {
  token: string;
  refreshToken: string;
}

export interface ResetPasswordI {
  email: string;
  password: string;
  otp: string;
}
