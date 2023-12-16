import {Injectable} from '@angular/core';

import {LoginData} from './LoginData';
import {RegisterData} from './RegisterData';
import {ReflectionSplashScreenService} from '../splash-screen';
import {ReflectionUser} from "../../interfaces";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {map, tap, catchError} from "rxjs/operators";
import {ApiService} from "../ApiBaseService/api.service";


interface AuthResponse {
  user: ReflectionUser;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authStateSubject = new BehaviorSubject<ReflectionUser | null>(null);
  authState$: Observable<ReflectionUser | null> = this.authStateSubject.asObservable();
  private apiUrl = 'auth'; // Assuming 'auth' is the endpoint for registration and login

  constructor(
    private apiService: ApiService,
    private splashService: ReflectionSplashScreenService,
  ) {
    // get the current user record if status code is 200 user is logged in else not
    this.apiService.get<ReflectionUser>('users/me').pipe(
      tap((response) => {
        const authResponse = <AuthResponse>{
          user: response,
          token: localStorage.getItem('token') || '',
        };
        this.handleAuthentication(authResponse);
      }),
      catchError((error) => this.handleError(error))
    ).subscribe();
    this.updateAuthState();
  }


  register(data: RegisterUserData): Observable<AuthResponse> {
    // const data = { firstName, lastName, email, password };
    return this.apiService.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError((error) => this.handleError(error))
    );
  }

  login(data: LoginUserData): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError((error) => this.handleError(error))
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUser(): any {
    return this.authStateSubject.getValue();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.authStateSubject.next(null);
  }

  private handleAuthentication(response: AuthResponse): void {
    const {user, token} = response;
    if (user && token) {
      localStorage.setItem('token', token);
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

  private handleError(error: any): Observable<never> {
    // You can customize this function based on your error handling requirements
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
