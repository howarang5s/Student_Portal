
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';  
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  adminData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private profileService: AdminService, private router: Router, private snackbar: SnackbarService) {}

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
        this.snackbar.showServiceFailureMessage(this.errorMessage,error);
      }
    );
  }

  editAdmin(adminData: any) {
    this.router.navigate(['/admin/edit-admin',adminData._id ]); 
  }

  
}
