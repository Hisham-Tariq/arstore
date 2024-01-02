import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://localhost:3000/api/v1'; // Replace with your actual API URL

  constructor(private http: HttpClient) {
  }

  private createHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Check if a token is available in local storage and add it to headers
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    console.log({headers: this.createHeaders()});
    return firstValueFrom(this.http.get<T>(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }



  post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return firstValueFrom(this.http.post<T>(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return firstValueFrom(this.http.put<T>(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }

  delete<T>(endpoint: string): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return firstValueFrom(this.http.delete<T>(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }

  patch<T>(endpoint: string, data: any):  Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return firstValueFrom(this.http.patch<T>(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }

  upload<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return firstValueFrom(this.http.post<T>(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }));
  }
}
