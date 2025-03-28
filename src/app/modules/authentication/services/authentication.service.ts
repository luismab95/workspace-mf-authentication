import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseI } from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import {
  LoginI,
  LoginOtpI,
  LoginResponseI,
  ResendOtpI,
  ResetPasswordI,
  UserI,
} from '../interfaces/authentication.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private urlApi = environment.apiUrl;

  constructor(private _httpClient: HttpClient) {}

  signIn(payload: LoginI): Observable<ResponseI<string>> {
    return this._httpClient.post<ResponseI<string>>(
      `${this.urlApi}/ms-authentication/security`,
      { ...payload }
    );
  }

  signUp(payload: UserI): Observable<ResponseI<string>> {
    return this._httpClient.post<ResponseI<string>>(
      `${this.urlApi}/ms-authentication/security/register`,
      { ...payload }
    );
  }

  resendOtp(payload: ResendOtpI): Observable<ResponseI<string>> {
    return this._httpClient.post<ResponseI<string>>(
      `${this.urlApi}/ms-authentication/security/resend-otp`,
      { ...payload }
    );
  }

  forgetPassword(email: string): Observable<ResponseI<string>> {
    return this._httpClient.post<ResponseI<string>>(
      `${this.urlApi}/ms-authentication/security/forget-password`,
      { email }
    );
  }

  signInMfa(payload: LoginOtpI): Observable<ResponseI<LoginResponseI>> {
    return this._httpClient.post<ResponseI<LoginResponseI>>(
      `${this.urlApi}/ms-authentication/security/mfa`,
      { ...payload }
    );
  }

  resetPassword(payload: ResetPasswordI): Observable<ResponseI<string>> {
    return this._httpClient.patch<ResponseI<string>>(
      `${this.urlApi}/ms-authentication/security/reset-password`,
      { ...payload }
    );
  }
}
