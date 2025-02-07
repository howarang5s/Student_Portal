import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:5000/api/student/profile';  

  constructor(private http: HttpClient) { }

  
  getStudentProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');  

    if (!token) {
      throw new Error('Token is missing or expired');
    }

    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers }); 
  }
}
