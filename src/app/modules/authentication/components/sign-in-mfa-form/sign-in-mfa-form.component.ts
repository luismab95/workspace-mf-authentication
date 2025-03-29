import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { publicIp } from 'public-ip';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { OtpComponent } from 'src/app/shared/components/otp/otp.component';
import { faTruckField } from '@fortawesome/free-solid-svg-icons';
import Pubsub from 'pubsub-js';

@Component({
  selector: 'mf-authentication-sign-in-mfa-form',
  templateUrl: './sign-in-mfa-form.component.html',
  imports: [RouterLink, ReactiveFormsModule, OtpComponent],
})
export class SignInMfaFormComponent implements OnInit, OnDestroy {
  message!: string;
  email!: string;
  loading: boolean = false;
  loadingResendOtp: boolean = false;
  publicIp!: string;
  deviceInformation!: string;
  loginForm!: UntypedFormGroup;

  private _router = inject(Router);
  private _authenticationService = inject(AuthenticationService);
  private _deviceDetectorService = inject(DeviceDetectorService);
  private _storageService = inject(StorageService);
  private _untypedFormBuilder = inject(UntypedFormBuilder);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.message =
      this._router.getCurrentNavigation()?.extras?.state?.['message'];
    this.email = this._router.getCurrentNavigation()?.extras?.state?.['email'];

    publicIp().then((ip) => {
      this.publicIp = ip;
    });
    const { browser, os, userAgent } =
      this._deviceDetectorService.getDeviceInfo();
    this.deviceInformation = `${browser}; ${os}; ${userAgent}`;

    this.loginForm = this._untypedFormBuilder.group({
      otp: [
        '',
        [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
      ],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  updateOtp(otp: string | null) {
    this.loginForm.get('otp')!.setValue(otp);
  }

  signInMfa() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this._authenticationService
      .signInMfa({
        email: this.email,
        information: this.deviceInformation,
        ipAddress: this.publicIp,
        otp: this.loginForm.value.otp,
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this._storageService.saveLocalStorage(
            'REFRESH_TOKEN',
            response.data.refreshToken
          );
          this._storageService.saveLocalStorage(
            'ACCESS_TOKEN',
            response.data.token
          );
          this.loading = false;
          Pubsub.publish('login-redirect', faTruckField);
        },
        error: (_error) => {
          this.loading = false;
        },
      });
  }

  resendOpt() {
    this.loginForm.reset();
    this.loadingResendOtp = true;
    this._authenticationService
      .resendOtp({ email: this.email, type: 'L' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.message = response.data;
          this.loadingResendOtp = false;
        },
        error: (_error) => {
          this.loadingResendOtp = false;
        },
      });
  }
}
