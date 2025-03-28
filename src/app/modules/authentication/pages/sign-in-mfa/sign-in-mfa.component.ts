import { Component } from '@angular/core';
import { SignInMfaFormComponent } from '../../components/sign-in-mfa-form/sign-in-mfa-form.component';

@Component({
  selector: 'mf-authentication-sign-in-mfa',
  templateUrl: './sign-in-mfa.component.html',
  imports: [SignInMfaFormComponent],
})
export class SignInMfaComponent {}
