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

  getTeacher(page:number,limit:number, sortField:string,sortOrder:string): Observable<any> {
    const url = `${this.apiUrl}/admin/teachers?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`;
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
    console.log(url);
    return this.http.get<any>(url,{ headers });
  }

  updateTeacher(teacherId: string, teacherData: any, ): Observable<any> {
    const url = `${this.apiUrl}/admin/updateTeacher/${teacherId}`;
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
    const url = `${this.apiUrl}/admin/addteacher`;
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
    const url = `${this.apiUrl}/admin/deleteTeacher/${teacherId}`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('Token is missing or expired');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.delete<any>(url, { headers });  
  }  

  getStudents(page:number, limit:number,sortField:string, sortOrder:string): Observable<any> {
    const url = `${this.apiUrl}/admin/students?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`;
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
  getStudentsByTeacher(): Observable<any> {
    const url = `${this.apiUrl}/admin/adminstudents`;
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

  updateStudent(studentId: string, teacherData: any, ): Observable<any> {
    const url = `${this.apiUrl}/admin/updateStudent/${studentId}`;
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

  addStudent(teacherData : any): Observable<any> {
    const url = `${this.apiUrl}/admin/addStudent`;
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

  deleteStudent(studentId: string): Observable<any> {
    const url = `${this.apiUrl}/admin/deleteStudent/${studentId}`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('Token is missing or expired');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.delete<any>(url, { headers });  
  }  
  getStudentById(studentId: string): Observable<any> {
    const url = `${this.apiUrl}/admin/student/${studentId}`;
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
  getCountStudents(): Observable<any> {
    const url = `${this.apiUrl}/dashbaord/students`;
    const token = this.authService.getToken();  

    
    if (!token) {
      throw new Error('Token is missing or expired');
    }
    console.log(url);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url,{ headers });
  }
  getCountTeachers(): Observable<any> {
    const url = `${this.apiUrl}/dashbaord/teachers`;
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
  bestStudent(): Observable<any> {
    const url = `${this.apiUrl}/dashbaord/beststudent`;
    const token = this.authService.getToken();  

    console.log(url);
    if (!token) {
      throw new Error('Token is missing or expired');
    }
    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });
    console.log('headers',headers);
    return this.http.get<any>(url,{ headers });
  }

  bestTeacher(): Observable<any> {
    const url = `${this.apiUrl}/dashbaord/bestteacher`;
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
}

