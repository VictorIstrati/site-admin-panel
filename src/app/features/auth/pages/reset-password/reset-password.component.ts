import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

interface ResetPasswordForm {
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
}

// Custom validator to check if passwords match
const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('passwordConfirm');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup<ResetPasswordForm>;
  token: string | null = null;
  resetComplete = false;
  tokenInvalid = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group<ResetPasswordForm>(
      {
        password: this.fb.control('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
          nonNullable: true,
        }),
        passwordConfirm: this.fb.control('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.tokenInvalid = true;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    // TODO: Implement reset password logic with store dispatch
    const resetRequest = {
      ...this.resetPasswordForm.getRawValue(),
      token: this.token,
    };

    console.log(resetRequest);
    this.resetComplete = true;

    // Navigate to login after successful reset
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 3000);
  }
}
