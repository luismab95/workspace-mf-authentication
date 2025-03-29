import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { AuthenticationRoutingModule } from './authentication.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loaderInterceptor } from 'src/app/shared/interceptors/loader.interceptor';
import { ErrorHandlerInterceptor } from 'src/app/shared/interceptors/error-handler.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SignInMfaComponent } from './pages/sign-in-mfa/sign-in-mfa.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { SignInMfaFormComponent } from './components/sign-in-mfa-form/sign-in-mfa-form.component';
import { ForgetPasswordFormComponent } from './components/forget-password-form/forget-password-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignInMfaComponent,
    SignUpComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    SignInFormComponent,
    SignInMfaFormComponent,
    SignUpFormComponent,
    ForgetPasswordFormComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    AuthenticationRoutingModule,
  ],
  providers: [
    AuthenticationService,
    StorageService,
    SocialAuthService,
    provideHttpClient(
      withFetch(),
      withInterceptors([ErrorHandlerInterceptor, loaderInterceptor])
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'es',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthenticationModule {}
