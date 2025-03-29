import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mf-authentication-forget-password',
  templateUrl: './forget-password.component.html',
  standalone: false,
})
export class ForgetPasswordComponent {
  apiUrlStatics: string = environment.apiUrlStatics;
}
