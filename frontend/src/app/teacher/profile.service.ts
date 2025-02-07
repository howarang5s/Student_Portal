// profile.service.ts (TeacherProfileService)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherProfileService {
  private apiUrl = environment.apiUrl;  // API endpoint for teacher profile

  constructor(private http: HttpClient) {}

  getTeacherProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/teacher/profile`, { headers });
  }

  updateTeacherProfile(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/teacher/update/profile/${id}`, data, { headers });
  }
}
