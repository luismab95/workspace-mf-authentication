import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { SignInMfaComponent } from './pages/sign-in-mfa/sign-in-mfa.component';

export default [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-in-mfa',
    component: SignInMfaComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: '**',
    redirectTo: 'sign-in',
  },
] as Routes;
