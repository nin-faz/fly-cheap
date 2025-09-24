import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ButtonLoadingService } from '../../../../core/services/button-loading.service';
import { ButtonLoadingComponent } from '../../../../shared/components/button-loading/button-loading';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
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
            >Connecte-toi pour profiter des meilleurs vols !</span
          >
        </div>
        <form [formGroup]="loginForm" class="space-y-6">
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
            <button
              mat-icon-button
              matSuffix
              (click)="togglePassword()"
              type="button"
              aria-label="Toggle password visibility"
            >
              <mat-icon>{{ showPassword ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
            @if (isFieldInvalid('password')) {
              <mat-error>{{ getFieldError('password') }}</mat-error>
            }
          </mat-form-field>
          <app-button-loading
            [loading$]="buttonLoadingService.loading$"
            normalText="Se connecter"
            loadingText="Connexion en cours..."
            [disabled]="!loginForm.valid"
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
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  protected readonly buttonLoadingService = inject(ButtonLoadingService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  error = signal<string>('');
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.error.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.router.navigate(['/']);
          this.authService.setCurrentUser(user);
        },
        error: (err) => {
          this.error.set(err.message || 'Erreur de connexion');
        },
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}
