import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mf-authentication-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: false,
})
export class SignInComponent {
  apiUrlStatics: string = environment.apiUrlStatics;
}
