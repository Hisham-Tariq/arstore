import { Injectable } from '@angular/core';
import { ReflectionSplashScreenService } from '../splash-screen';
import { ReflectionUser } from '../../interfaces';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from '../ApiBaseService/api.service';

interface AuthResponse {
  user: ReflectionUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authStateSubject = new BehaviorSubject<ReflectionUser | null>(null);
  authState$: Observable<ReflectionUser | null> =
    this.authStateSubject.asObservable();
  private apiUrl = 'auth'; // Assuming 'auth' is the endpoint for registration and login

  constructor(
    private apiService: ApiService,
    private splashService: ReflectionSplashScreenService,
    private router: Router
  ) {
    // get the current user record if status code is 200 user is logged in else not
    this.apiService
      .get<ReflectionUser>('users/me')
      .then((response) => {
        const authResponse = <AuthResponse>{
          user: response,
        };
        this.handleAuthentication(authResponse);
      })
      .catch((err) => {
        this.isAuthenticatedSubject.next(false);
        this.authStateSubject.next(null);
        this.handleError(err);
      });
    this.updateAuthState();
  }

  async register(data: RegisterUserData): Promise<AuthResponse> {
    try {
      const response = await this.apiService.post<AuthResponse>(
        `${this.apiUrl}/register`,
        data
      );
      this.handleAuthentication(response);
      return response;
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async login(data: LoginUserData): Promise<AuthResponse> {
    try {
      const response = await this.apiService.post<AuthResponse>(
        `${this.apiUrl}/login`,
        data
      );
      this.handleAuthentication(response);
      return response;
    } catch (error) {
      return await this.handleError(error);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUser(): ReflectionUser | null {
    return this.authStateSubject.getValue();
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.authStateSubject.next(null);
    //   navigate to home page
    this.router.navigate(['/']);
  }

  private handleAuthentication(response: AuthResponse): void {
    // Read the token from the cookie
    const { user } = response;
    if (user) {
      this.isAuthenticatedSubject.next(true);
      this.authStateSubject.next(user);
    }
  }

  private updateAuthState(): void {
    this.isAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        this.authStateSubject.next(this.getUser());
      } else {
        this.authStateSubject.next(null);
        this.splashService.hide();
      }
    });
  }

  private handleError(error: any): Promise<never> {
    console.error('Error:', error);

    if (error.status === 400) {
      if (error.error.message === 'Invalid email or password') {
        // Handle invalid credentials error
        // For example, you can display a message to the user
      } else if (error.error.message === 'Email is already registered') {
        // Handle email already exists error
        // For example, you can display a message to the user
      } else if (error.error.message === 'The user is not authorized') {
        this.isAuthenticatedSubject.next(false);
        this.authStateSubject.next(null);
      }
    }

    // Rethrow the error to propagate it to the subscriber
    throw error;
  }
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}
