import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  private authSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.authForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupFormValidation();
    this.subscribeToAuthState();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private subscribeToAuthState(): void {
    this.authSubscription = this.authService.authState$.subscribe((user) => {
      if (user && this.isLoading) {
        // User is authenticated, redirect to home
        this.router.navigate(['/']);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    });
  }

  private setupFormValidation(): void {
    this.updateValidators();
  }

  private updateValidators(): void {
    const nameControl = this.authForm.get('name');
    const confirmPasswordControl = this.authForm.get('confirmPassword');

    if (this.isLoginMode) {
      // Login mode - remove name and confirm password validators
      nameControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
      this.authForm.clearValidators();
    } else {
      // Signup mode - add name and confirm password validators
      nameControl?.setValidators([
        Validators.required,
        Validators.minLength(2),
      ]);
      confirmPasswordControl?.setValidators([Validators.required]);
      this.authForm.setValidators(this.passwordMatchValidator);
    }

    nameControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    this.authForm.updateValueAndValidity();
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
    this.clearMessages();
    this.authForm.reset();
    this.updateValidators();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const { email, password, name } = this.authForm.value;

      if (this.isLoginMode) {
        await this.authService.signInWithEmail(email, password);
        this.showSuccessMessage('Successfully signed in!');
      } else {
        await this.authService.signUpWithEmail(email, password, name);
        this.showSuccessMessage('Account created successfully!');
      }
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.clearMessages();

    try {
      await this.authService.signInWithGoogle();
      this.showSuccessMessage('Successfully signed in with Google!');
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithFacebook(): Promise<void> {
    this.isLoading = true;
    this.clearMessages();

    try {
      await this.authService.signInWithFacebook();
      this.showSuccessMessage('Successfully signed in with Facebook!');
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithTwitter(): Promise<void> {
    this.isLoading = true;
    this.clearMessages();

    try {
      await this.authService.signInWithTwitter();
      this.showSuccessMessage('Successfully signed in with Twitter!');
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async forgotPassword(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.authForm.get('email')?.value;
    if (!email) {
      this.showErrorMessage('Please enter your email address first.');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showErrorMessage('Please enter a valid email address.');
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.sendPasswordResetEmail(email);
      this.showSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);
    this.showErrorMessage(
      error.message || 'An unexpected error occurred. Please try again.'
    );
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    // Clear message after delay
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.snackBar.open(message, 'Close', {
      duration: 8000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    // Clear message after delay
    setTimeout(() => {
      this.errorMessage = '';
    }, 8000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.authForm.controls).forEach((key) => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helper method to check if user is already authenticated
  private checkAuthState(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }
}
