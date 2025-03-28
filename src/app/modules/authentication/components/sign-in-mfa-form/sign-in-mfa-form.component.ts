import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
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

@Component({
  selector: 'mf-authentication-sign-in-mfa-form',
  templateUrl: './sign-in-mfa-form.component.html',
  imports: [RouterLink, ReactiveFormsModule],
})
export class SignInMfaFormComponent implements OnInit, OnDestroy {
  message!: string;
  email!: string;
  loading: boolean = false;
  loadingResendOtp: boolean = false;
  publicIp!: string;
  deviceInformation!: string;
  loginForm!: UntypedFormGroup;
  otp!: string;

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
      otp1: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp2: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp3: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp4: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res.otp1 && res.otp2 && res.otp3 && res.otp4) {
          this.otp = `${res.otp1}${res.otp2}${res.otp3}${res.otp4}`;
        } else {
          this.otp = '';
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  signInMfa() {
    if (this.loginForm.invalid || this.otp === '') return;

    this.loading = true;
    this._authenticationService
      .signInMfa({
        email: this.email,
        information: this.deviceInformation,
        ipAddress: this.publicIp,
        otp: this.otp,
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this._storageService.saveLocalStorage(
            'refreshToken',
            response.data.refreshToken
          );
          this._storageService.saveLocalStorage(
            'accessToken',
            response.data.token
          );
          this.loading = false;
          this._router.navigateByUrl('/admin');
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
