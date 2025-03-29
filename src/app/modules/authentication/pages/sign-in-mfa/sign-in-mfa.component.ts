import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mf-authentication-sign-in-mfa',
  templateUrl: './sign-in-mfa.component.html',
  standalone: false,
})
export class SignInMfaComponent {
    apiUrlStatics: string = environment.apiUrlStatics;
  
}
