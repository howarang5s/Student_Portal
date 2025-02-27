import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';  
import { AdminService } from 'src/app/admin/admin.service';
import { AuthService } from 'src/app/auth/auth-service.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  studentData: any = null;
  teacherData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private profileService: ProfileService, 
    private router: Router,
    private adminService: AdminService, 
    private snackbar: SnackbarService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchStudentProfile();
  }

  fetchStudentProfile() {
    this.profileService.getStudentProfile().subscribe(
      (data) => {
        this.studentData = data;

        if (data.subjects && data.subjects.length > 0) {
          const firstSubject = data.subjects[0]; 
          this.teacherData = {
            name: firstSubject.teacherName,
            email: firstSubject.teacherEmail
          };
        } else {
          this.teacherData = null;
        }

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;  
        this.errorMessage = 'You have not been added by any teacher yet.';
        this.snackbar.showErrorMessage(this.errorMessage);
      }
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    let storedUser: any = localStorage.getItem('loggedInUser');
    storedUser = JSON.parse(storedUser); 

    this.authService.logout(storedUser._id).subscribe(
      () => {
        console.log('Logged Out');
      },
      (error) => {
        console.log(error);
      }
    );

    this.router.navigate(['auth/login']);
  }
}
