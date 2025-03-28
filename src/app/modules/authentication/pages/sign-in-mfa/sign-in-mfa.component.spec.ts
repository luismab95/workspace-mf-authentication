import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInMfaComponent } from './sign-in-mfa.component';

describe('SignInMfaComponent', () => {
  let component: SignInMfaComponent;
  let fixture: ComponentFixture<SignInMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInMfaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
