import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ButtonLoadingService } from '../../../../core/services/button-loading.service';
import { ButtonLoadingComponent } from '../../../../shared/components/button-loading/button-loading';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else if (confirmPassword?.hasError('passwordMismatch')) {
    const errors = { ...confirmPassword.errors };
    delete errors['passwordMismatch'];
    confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonLoadingComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <mat-card class="w-full max-w-md p-8 pt-16 shadow-xl rounded-2xl">
        <div class="flex flex-col items-center mb-8">
          <div class="bg-white rounded-full absolute z-20 shadow-lg p-3 -mt-32">
            <img src="assets/logo-fly.png" alt="Logo FlyCheap" class="h-24 w-24 object-contain" />
          </div>
          <span class="text-base text-blue-500 font-medium pt-5"
            >Créer ton compte pour voyager moins cher !</span
          >
        </div>
        <form [formGroup]="registerForm" class="space-y-6">
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Nom complet</mat-label>
            <input matInput type="text" formControlName="name" />
            @if (isFieldInvalid('name')) {
              <mat-error>{{ getFieldError('name') }}</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Numéro de téléphone</mat-label>
            <input matInput type="tel" formControlName="phone" placeholder="+33 6 12 34 56 78" />
            @if (isFieldInvalid('phone')) {
              <mat-error>{{ getFieldError('phone') }}</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Adresse email</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (isFieldInvalid('email')) {
              <mat-error>{{ getFieldError('email') }}</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Mot de passe</mat-label>
            <input
              matInput
              [type]="showPassword ? 'text' : 'password'"
              formControlName="password"
            />
            <button mat-icon-button matSuffix type="button" (click)="togglePassword()">
              <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (isFieldInvalid('password')) {
              <mat-error>{{ getFieldError('password') }}</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Confirmer le mot de passe</mat-label>
            <input
              matInput
              [type]="showConfirmPassword ? 'text' : 'password'"
              formControlName="confirmPassword"
            />
            <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPassword()">
              <mat-icon>{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (isFieldInvalid('confirmPassword')) {
              <mat-error>{{ getFieldError('confirmPassword') }}</mat-error>
            }
          </mat-form-field>
          <app-button-loading
            [loading$]="buttonLoadingService.loading$"
            normalText="Créer le compte"
            loadingText="Création en cours..."
            [disabled]="!registerForm.valid"
            (buttonClick)="onSubmit()"
          >
          </app-button-loading>
          @if (error()) {
            <p class="text-sm text-center text-red-700">{{ error() }}</p>
          }
        </form>
      </mat-card>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  protected readonly buttonLoadingService = inject(ButtonLoadingService);
  private readonly router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  registerForm: FormGroup;
  error = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        phone: ['', [Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.error.set('');

      const { confirmPassword, ...userData } = this.registerForm.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = confirmPassword;

      this.authService.register(userData).subscribe({
        next: (newUser) => {
          // Auto-login user after successful registration
          this.authService.setCurrentUser(newUser);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set(err.message || 'Erreur lors de la création du compte');
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['pattern']) return 'Format de numéro de téléphone invalide';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
