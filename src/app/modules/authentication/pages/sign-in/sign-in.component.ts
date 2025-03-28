import { Component } from '@angular/core';
import { SignInFormComponent } from '../../components/sign-in-form/sign-in-form.component';

@Component({
  selector: 'mf-authentication-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [SignInFormComponent],
})
export class SignInComponent {}
