import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LoginI } from '../../interfaces/authentication.interface';

@Component({
  selector: 'mf-authentication-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  imports: [
    RouterLink,
    FontAwesomeModule,
    GoogleSigninButtonModule,
    ReactiveFormsModule,
  ],
})
export class SignInFormComponent implements OnInit, OnDestroy {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  show: boolean = false;
  loading: boolean = false;
  loginForm!: UntypedFormGroup;

  private _router = inject(Router);
  private _untypedFormBuilder = inject(UntypedFormBuilder);
  private _authenticationService = inject(AuthenticationService);
  private _socialAuthService = inject(SocialAuthService);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.loginForm = this._untypedFormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      type: ['L', Validators.required],
    });
  }

  ngOnInit(): void {
    this._socialAuthService.authState
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user) => {
        this.signIn({
          email: user.email,
          password: user.idToken,
          type: 'G',
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  showPassword() {
    this.show = !this.show;
  }

  signInLocal() {
    if (this.loginForm.invalid) return;
    const payload = this.loginForm.value as LoginI;
    this.signIn(payload);
  }

  signIn(payload: LoginI) {
    this.loading = true;
    this._authenticationService
      .signIn(payload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        error: (_error) => {
          this.loading = false;
        },
        next: (response) => {
          this.loading = false;
          this._router.navigateByUrl('/authentication/sign-in-mfa', {
            state: { message: response.data, email: payload.email },
          });
        },
      });
  }
}
