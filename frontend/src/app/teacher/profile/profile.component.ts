// teacher-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherProfileService } from '../profile.service';  // Import the ProfileService

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  teacherData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private profileService: TeacherProfileService, private router: Router) {}

  ngOnInit() {
    this.fetchTeacherProfile();
  }

  fetchTeacherProfile() {
    this.profileService.getTeacherProfile().subscribe(
      (data) => {
        this.teacherData = data;  
        this.isLoading = false;  
      },
      (error) => {
        this.isLoading = false;  
        this.errorMessage = 'Failed to load teacher profile. Please try again later.';
        console.error('Error fetching teacher profile:', error);  // Log the error
      }
    );
  }

  // editTeacher(teacherData: any) {
  //   this.router.navigate(['/edit-teacher',teacherData._id ]); // Navigate to the edit page
  // }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
