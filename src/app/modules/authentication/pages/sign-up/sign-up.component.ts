import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mf-authentication-sign-up',
  templateUrl: './sign-up.component.html',
  standalone: false,
})
export class SignUpComponent {
  apiUrlStatics: string = environment.apiUrlStatics;
}
