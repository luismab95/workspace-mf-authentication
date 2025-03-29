import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { ResetPasswordI } from '../../interfaces/authentication.interface';
import { matchPasswordValidator } from 'src/app/shared/utils/validators.utils';
import { OtpComponent } from 'src/app/shared/components/otp/otp.component';
import Pubsub from 'pubsub-js';

@Component({
  selector: 'mf-authentication-forget-password-form',
  templateUrl: './forget-password-form.component.html',
  imports: [RouterLink, FontAwesomeModule, ReactiveFormsModule, OtpComponent],
})
export class ForgetPasswordFormComponent implements OnInit, OnDestroy {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  show: boolean = false;
  forgetPassword: boolean = true;
  resetPassword: boolean = false;
  loading: boolean = false;
  loadingResendOtp: boolean = false;
  message!: string;
  emailFormControl!: FormControl;
  resetPasswordForm!: UntypedFormGroup;

  private _authenticationService = inject(AuthenticationService);
  private _untypedFormBuilder = inject(UntypedFormBuilder);
  private _router = inject(Router);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);

    this.resetPasswordForm = this._untypedFormBuilder.group(
      {
        otp: [
          '',
          [
            Validators.required,
            Validators.maxLength(8),
            Validators.minLength(8),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchPasswordValidator('password', 'confirmPassword') }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  showPassword() {
    this.show = !this.show;
  }

  onForgetPassword() {
    if (this.emailFormControl.invalid) return;

    this.loading = true;
    this._authenticationService
      .forgetPassword(this.emailFormControl.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.message = response.data;
          this.forgetPassword = false;
          this.resetPassword = true;
        },
        error: (_error) => {
          this.loading = false;
        },
      });
  }

  updateOtp(otp: string | null) {
    this.resetPasswordForm.get('otp')!.setValue(otp);
  }

  resendOpt() {
    this.resetPasswordForm.reset();
    this.loadingResendOtp = true;
    this._authenticationService
      .resendOtp({ email: this.emailFormControl.value, type: 'R' })
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

  updatePassword() {
    if (this.resetPasswordForm.invalid) return;

    this.loading = true;

    const payload = {
      email: this.emailFormControl.value,
      otp: this.resetPasswordForm.value.otp,
      password: this.resetPasswordForm.value.password,
    } as ResetPasswordI;

    this._authenticationService
      .resetPassword(payload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.loading = false;
          Pubsub.publish('success', response.data);
          this._router.navigateByUrl('/authentication/sign-in');
        },
        error: (_error) => {
          this.loading = false;
        },
      });
  }
}
