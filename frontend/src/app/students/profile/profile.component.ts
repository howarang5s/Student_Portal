import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';  // Import the ProfileService

@Component({
  selector: 'app-student-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  studentData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.fetchStudentProfile();
  }

  fetchStudentProfile() {
    this.profileService.getStudentProfile().subscribe(
      (data) => {
        this.studentData = data; 
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;  
        this.errorMessage = 'You have not been added by any teacher yet.';  
      }
    );
    
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
