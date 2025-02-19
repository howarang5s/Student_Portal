import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';  
import { AdminService } from 'src/app/admin/admin.service';
import { TeacherModule } from 'src/app/teacher/teacher.module';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  studentData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  teacherData: any = null;
  

  constructor(private profileService: ProfileService, private router: Router,private adminService: AdminService, private snackbar: SnackbarService) {}

  ngOnInit() {
    this.fetchStudentProfile();
  }

  fetchStudentProfile() {
    var teacherId = null
    this.profileService.getStudentProfile().subscribe(
      (data) => {
        this.studentData = data; 
        
        console.log(this.studentData.addedBy);
        this.adminService.getTeacherById(this.studentData.addedBy).subscribe(
          (response)=>{
            this.teacherData = response.name;
            this.studentData.addedBy = this.teacherData;
          }
        )
        
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
    localStorage.removeItem('loggedInUser');
    
    this.router.navigate(['auth/login']);
  }
}
