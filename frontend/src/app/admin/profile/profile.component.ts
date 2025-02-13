// teacher-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';  // Import the ProfileService

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  adminData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private profileService: AdminService, private router: Router) {}

  ngOnInit() {
    this.fetchTeacherProfile();
  }

  fetchTeacherProfile() {
    this.profileService.getProfile().subscribe(
      (data) => {
        this.adminData = data;  
        this.isLoading = false;  
      },
      (error) => {
        this.isLoading = false;  
        this.errorMessage = 'Failed to load teacher profile. Please try again later.';
        console.error('Error fetching teacher profile:', error);  
      }
    );
  }

  editAdmin(adminData: any) {
    this.router.navigate(['/edit-admin',adminData._id ]); 
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
