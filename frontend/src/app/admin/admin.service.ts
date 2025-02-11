import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth-service.service';  
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl;  
    
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  getTeacher(): Observable<any> {
    const url = `${this.apiUrl}/admin/teachers`;
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

  getTeacherById(teacherId: string): Observable<any> {
    const url = `${this.apiUrl}/admin/teacher/${teacherId}`;
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

  updateTeacher(teacherId: string, teacherData: any, ): Observable<any> {
    const url = `${this.apiUrl}/admin/update/${teacherId}`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.put<any>(url, teacherData, { headers });
  }

  addTeacher(teacherData : any): Observable<any> {
    const url = `${this.apiUrl}/admin/add`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.post<any>(url, teacherData, { headers });  
  }

  deleteTeacher(teacherId: string): Observable<any> {
    const url = `${this.apiUrl}/admin/delete/${teacherId}`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('Token is missing or expired');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.delete<any>(url, { headers });  
  }  

  getStudents(): Observable<any> {
    const url = `${this.apiUrl}/admin/students`;
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

  getProfile(): Observable<any> {
    const url = `${this.apiUrl}/admin/profile`;
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
  updateProfile(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/admin/update/profile/${id}`, data, { headers });
  }
}
