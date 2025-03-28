import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInMfaFormComponent } from './sign-in-mfa-form.component';

describe('SignInMfaFormComponent', () => {
  let component: SignInMfaFormComponent;
  let fixture: ComponentFixture<SignInMfaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInMfaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInMfaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
