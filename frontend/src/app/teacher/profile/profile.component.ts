
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherProfileService } from '../profile.service';  
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  teacherData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private profileService: TeacherProfileService, private router: Router,private snackbar: SnackbarService) {}

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
        this.snackbar.showServiceFailureMessage('Error fetching teacher profile:', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');    
    this.router.navigate(['auth/login']);
  }
}
