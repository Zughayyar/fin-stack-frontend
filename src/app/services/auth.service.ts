import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from '../config/app.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TokenResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

export interface AuthError {
  message: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private tokenKey = 'finstack_token';
  private userKey = 'finstack_user';
  
  // BehaviorSubjects to track authentication state
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(this.getUserFromStorage());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = this.configService.authApiUrl;
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  /**
   * Register a new user
   */
  register(registerData: RegisterRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Login user
   */
  login(loginData: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.handleLogout()),
        catchError(() => {
          // Even if the server request fails, we still want to clear local storage
          this.handleLogout();
          return throwError(() => new Error('Logout failed'));
        })
      );
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get current user synchronously
   */
  getCurrentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    // Ensure we return null instead of empty string
    return token && token.trim() !== '' ? token : null;
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: TokenResponse): void {
    // Save token and user data
    localStorage.setItem(this.tokenKey, response.token);
    this.saveUserToStorage(response.user);
    
    // Update subjects
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    this.clearAuthData();
  }

  /**
   * Check if token exists and is valid
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT token (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        this.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Check token validity and refresh user data if needed
   */
  private checkTokenValidity(): void {
    if (this.hasValidToken() && !this.getCurrentUserValue()) {
      // Token exists but no user data, fetch current user
      this.getCurrentUser().subscribe({
        error: () => this.clearAuthData()
      });
    }
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): UserInfo | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: UserInfo): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        this.clearAuthData();
      }
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };


} 