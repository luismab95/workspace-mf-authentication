import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
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
import { UserI } from '../../interfaces/authentication.interface';

@Component({
  selector: 'mf-authentication-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  imports: [
    RouterLink,
    FontAwesomeModule,
    GoogleSigninButtonModule,
    ReactiveFormsModule,
  ],
})
export class SignUpFormComponent implements OnInit, OnDestroy {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  show: boolean = false;
  loading: boolean = false;
  registerForm!: UntypedFormGroup;

  private _router = inject(Router);
  private _untypedFormBuilder = inject(UntypedFormBuilder);
  private _authenticationService = inject(AuthenticationService);
  private _socialAuthService = inject(SocialAuthService);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.registerForm = this._untypedFormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required, Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      type: ['L', Validators.required],
    });
  }

  ngOnInit(): void {
    this._socialAuthService.authState
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user) => {
        this.signUp({
          email: user.email,
          password: user.idToken,
          type: 'G',
          firstname: user.firstName,
          lastname: user.lastName,
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

  signUpLocal() {
    if (this.registerForm.invalid) return;

    const payload = this.registerForm.value as UserI;
    this.signUp(payload);
  }

  signUp(payload: UserI) {
    this.loading = true;

    this._authenticationService
      .signUp(payload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        error: (_error) => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this._router.navigateByUrl('/authentication/sign-in');
        },
      });
  }
}
