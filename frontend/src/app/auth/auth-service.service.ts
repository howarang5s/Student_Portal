// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  
  logout(): void {
    localStorage.removeItem('authToken'); 
  }

  
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }

  
  forgotPassword(email: string, newPassword: string): Observable<any> {
    const url = `${this.apiurl}/auth/forgot-Password`;
    return this.http.post<any>(url, { email, newPassword });
  }

  login( email: string, password: string): Observable<any> {
    console.log('URL from environment',this.apiurl)
    const url = `${this.apiurl}/auth/`;

    return this.http.post<any>(url, { email, password });
  }

  register( name: string, email: string, password: string, role: string ): Observable<any> {
    console.log('URL from environment',this.apiurl)
    const url = `${this.apiurl}/auth/register`;
    console.log('URL from environment',url)
    return this.http.post<any>(url, { name, email, password, role });
  }
   
  verifyEmail(token: string): Observable<any> {
    console.log('Requesting verification with token:', token); // Log the token
    console.log('Verification Url', this.apiurl); // Log the token
    return this.http.get(`${this.apiurl}/verify/${token}`);
  }  

  
  
}
