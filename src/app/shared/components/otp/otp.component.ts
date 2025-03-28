import { Component, inject, output } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mf-authentication-otp',
  templateUrl: './otp.component.html',
  imports: [ReactiveFormsModule],
})
export class OtpComponent {
  otp!: string | null;
  otpForm!: UntypedFormGroup;
  otpEvent = output<string | null>();

  private _untypedFormBuilder = inject(UntypedFormBuilder);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.otpForm = this._untypedFormBuilder.group({
      otp1: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp2: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp3: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      otp4: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
    });
  }

  ngOnInit(): void {
    this.otpForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res.otp1 && res.otp2 && res.otp3 && res.otp4) {
          this.otp = `${res.otp1}${res.otp2}${res.otp3}${res.otp4}`;
        } else {
          this.otp = null;
        }
        this.otpEvent.emit(this.otp);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
