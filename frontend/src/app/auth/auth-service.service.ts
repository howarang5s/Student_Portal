// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiurl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  saveToken(token: string): void {
    localStorage.setItem('authToken', token); 
  }
  
  saveCurrentUser(user: object): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user)); 
  }

  getCurrentUser(): object | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }


  
  getToken(): string | null {
    return localStorage.getItem('authToken'); 
  }

  
  logout(sessionID: string): Observable<any> {
    const url = `${this.apiurl}/auth/logout`;
    return this.http.post<any>(url, { sessionID });
  }
  

  
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }

  checkActiveSession(userId:string ): Observable<boolean> {
  
    const apiUrl = `${this.apiurl}/auth/session/check`;
    
  
    return this.http.post<{ isValid: boolean }>(apiUrl,{userId}).pipe(
      map((response) => {
        
        return response.isValid;
      }),
      
    );
  }
  
  
  
  forgotPassword(email: string, newPassword: string): Observable<any> {
    const url = `${this.apiurl}/auth/forgot-Password`;
    return this.http.post<any>(url, { email, newPassword });
  }

  login( email: string, password: string): Observable<any> {
    
    const url = `${this.apiurl}/auth/`;

    return this.http.post<any>(url, { email, password });
  }

  register( name: string, email: string, password: string, role: string ): Observable<any> {
    
    const url = `${this.apiurl}/auth/register`;
    
    return this.http.post<any>(url, { name, email, password, role });
  }
   
  verifyOtp(email: string, otp: string) {
    return this.http.post<{ isVerified: boolean }>(`${this.apiurl}/verify-otp`, { email, otp });
  }
  
  
  resendOtp(email: string) {
    return this.http.post<{ message: string }>('http://localhost:5000/api/resend-otp', { email });
  }

  sendOTP(email:string): Observable<any> {
    return this.http.post<any>('http://localhost:5000/api/auth/sendMailto', { email });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token'); 
    return !!token; 
  }
  
  
  
}
