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

@Component({
  selector: 'mf-authentication-forget-password-form',
  templateUrl: './forget-password-form.component.html',
  imports: [RouterLink, FontAwesomeModule, ReactiveFormsModule],
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
  otp!: string;

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
        otp1: [
          '',
          [
            Validators.required,
            Validators.maxLength(2),
            Validators.minLength(2),
          ],
        ],
        otp2: [
          '',
          [
            Validators.required,
            Validators.maxLength(2),
            Validators.minLength(2),
          ],
        ],
        otp3: [
          '',
          [
            Validators.required,
            Validators.maxLength(2),
            Validators.minLength(2),
          ],
        ],
        otp4: [
          '',
          [
            Validators.required,
            Validators.maxLength(2),
            Validators.minLength(2),
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

  ngOnInit(): void {
    this.resetPasswordForm.valueChanges
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
      otp: this.otp,
      password: this.resetPasswordForm.get('password')!.value,
    } as ResetPasswordI;

    this._authenticationService
      .resetPassword(payload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        complete: () => {
          this.loading = false;
          this._router.navigateByUrl('/authentication/sign-in');
        },
        error: (_error) => {
          this.loading = false;
        },
      });
  }
}
