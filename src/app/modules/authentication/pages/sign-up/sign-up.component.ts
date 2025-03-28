import { Component } from '@angular/core';
import { SignUpFormComponent } from '../../components/sign-up-form/sign-up-form.component';

@Component({
  selector: 'mf-authentication-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [SignUpFormComponent],
})
export class SignUpComponent {}
