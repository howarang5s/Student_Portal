// src/app/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth-service.service';  
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = environment.apiUrl;  
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  
  getStudents(subject:string,page:number, limit:number,sortField:string, sortOrder:string): Observable<any> {
    const url = `${this.apiUrl}/teacher/students?subject=${subject}&page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`;
    const token = this.authService.getToken();  
    

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
    return this.http.get<any>(url, { headers });  
  }
  
  getDashboardStats(): Observable<any> {
    const url = `${this.apiUrl}/teacher/dahboardstats`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
    return this.http.get<any>(url,{ headers });
  }

  getFilteredUsers(subject : string): Observable<any> {
    
    const url = `${this.apiUrl}/teacher/filteredStudents/${subject}`;
    const token = this.authService.getToken();  
    

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
    return this.http.get<any>(url, { headers });  
  }


  getStudentById(studentId: string, subject: string): Observable<any> {
    const url = `${this.apiUrl}/teacher/student/${studentId}?subject=${subject}`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
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

  updateStudent(studentId: string, studentData: any, subject:string): Observable<any> {
    
    const url = `${this.apiUrl}/teacher/update/${studentId}?subject=${subject}`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
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
    
    return this.http.post<any>(url, studentData, { headers });  
  }

  deleteStudent(studentId: string,subject:string): Observable<any> {
    const url = `${this.apiUrl}/teacher/delete/${studentId}?subject=${subject}`;
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
    

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    
    return this.http.get<any>(url, { headers });  
  }
}
