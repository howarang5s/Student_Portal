// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth/forgot-Password';  // API endpoint for student profile

  constructor(private http: HttpClient) { }
  
  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Save the token to localStorage
  }

  
  getToken(): string | null {
    return localStorage.getItem('authToken'); 
  }

  
  logout(): void {
    localStorage.removeItem('authToken'); 
  }

  
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }

  
  forgotPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, newPassword });
  }
}
