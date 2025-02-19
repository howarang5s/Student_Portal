// src/app/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = environment.apiUrl;  
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  
  getStudents(): Observable<any> {
    const url = `${this.apiUrl}/teacher/students`;
    const token = this.authService.getToken();  
    console.log(token);

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url, { headers });  
  }

  getFilteredUsers(): Observable<any> {
    const url = `${this.apiUrl}/teacher/filteredStudents`;
    const token = this.authService.getToken();  
    console.log(token);

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url, { headers });  
  }


  getStudentById(studentId: string): Observable<any> {
    const url = `${this.apiUrl}/teacher/student/${studentId}`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url,{ headers });
  }

  getProfile(userId: string): Observable<any> {
    const url = `${this.apiUrl}/student/profile/${userId}`;
    const token = this.authService.getToken();  

    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    return this.http.get<any>(url, { headers });
  }

  updateStudent(studentId: string, studentData: any, ): Observable<any> {
    const url = `${this.apiUrl}/teacher/update/${studentId}`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.put<any>(url, studentData, { headers });
  }

  addStudent(studentData : any): Observable<any> {
    const url = `${this.apiUrl}/teacher/add`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.post<any>(url, studentData, { headers });  
  }

  deleteStudent(studentId: string): Observable<any> {
    const url = `${this.apiUrl}/teacher/delete/${studentId}`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('Token is missing or expired');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.delete<any>(url, { headers });  
  }  

  
  getUsers(): Observable<any> {
    const url = `${this.apiUrl}/teacher/users`;
    const token = this.authService.getToken();  
    console.log(token);

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url, { headers });  
  }
}
