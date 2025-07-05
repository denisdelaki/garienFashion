import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  User,
  updateProfile,
  UserCredential,
  onAuthStateChanged,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { authState } from '@angular/fire/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();
  private facebookProvider = new FacebookAuthProvider();
  private twitterProvider = new TwitterAuthProvider();

  // BehaviorSubject to track authentication state
  private authStateSubject = new BehaviorSubject<AuthUser | null>(null);
  public authState$ = this.authStateSubject.asObservable();

  // Observable of authentication state
  user$: Observable<User | null> = authState(this.auth);

  constructor(private router: Router) {
    // Initialize auth state listener
    this.initAuthStateListener();

    // Configure Google provider
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');

    // Configure Facebook provider
    this.facebookProvider.addScope('email');

    // Configure Twitter provider
    this.twitterProvider.addScope('email');
  }

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        this.authStateSubject.next(authUser);
      } else {
        this.authStateSubject.next(null);
      }
    });
  }

  // Sign up with email and password
  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update user profile with display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      console.log('User created successfully:', userCredential.user);
      return userCredential;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign in with email and password
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('User signed in successfully:', userCredential.user);
      return userCredential;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const userCredential = await signInWithPopup(
        this.auth,
        this.googleProvider
      );
      console.log('Google sign in successful:', userCredential.user);
      return userCredential;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign in with Facebook
  async signInWithFacebook(): Promise<UserCredential> {
    try {
      const userCredential = await signInWithPopup(
        this.auth,
        this.facebookProvider
      );
      console.log('Facebook sign in successful:', userCredential.user);
      return userCredential;
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign in with Twitter
  async signInWithTwitter(): Promise<UserCredential> {
    try {
      const userCredential = await signInWithPopup(
        this.auth,
        this.twitterProvider
      );
      console.log('Twitter sign in successful:', userCredential.user);
      return userCredential;
    } catch (error: any) {
      console.error('Twitter sign in error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent to:', email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Update user profile
  async updateUserProfile(
    displayName?: string,
    photoURL?: string
  ): Promise<void> {
    try {
      if (this.auth.currentUser) {
        await updateProfile(this.auth.currentUser, {
          displayName: displayName || this.auth.currentUser.displayName,
          photoURL: photoURL || this.auth.currentUser.photoURL,
        });
        console.log('User profile updated successfully');
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User signed out successfully');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Get current user
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  // Get current auth user (simplified)
  get currentAuthUser(): AuthUser | null {
    return this.authStateSubject.value;
  }

  // Check if user is authenticated
  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Check if user is logged in (alias for isAuthenticated)
  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Get user display name
  get userDisplayName(): string | null {
    return this.auth.currentUser?.displayName || null;
  }

  // Get user email
  get userEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Get user photo URL
  get userPhotoURL(): string | null {
    return this.auth.currentUser?.photoURL || null;
  }

  // Check if email is verified
  get isEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified || false;
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    try {
      if (this.auth.currentUser) {
        const { sendEmailVerification } = await import('@angular/fire/auth');
        await sendEmailVerification(this.auth.currentUser);
        console.log('Email verification sent');
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Handle Firebase errors and return user-friendly messages
  private handleFirebaseError(error: any): Error {
    let message = '';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed before completion.';
        break;
      case 'auth/popup-blocked':
        message = 'Sign-in popup was blocked by the browser.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/account-exists-with-different-credential':
        message =
          'An account already exists with the same email but different sign-in credentials.';
        break;
      case 'auth/requires-recent-login':
        message =
          'This operation requires recent authentication. Please sign in again.';
        break;
      default:
        message =
          error.message || 'An unexpected error occurred. Please try again.';
        break;
    }

    const customError = new Error(message);
    (customError as any).code = error.code;
    return customError;
  }

  // Helper method to check if user has specific provider
  hasProvider(providerId: string): boolean {
    if (!this.auth.currentUser) return false;

    return this.auth.currentUser.providerData.some(
      (provider) => provider.providerId === providerId
    );
  }

  // Get all provider IDs for current user
  getUserProviders(): string[] {
    if (!this.auth.currentUser) return [];

    return this.auth.currentUser.providerData.map(
      (provider) => provider.providerId
    );
  }
}
