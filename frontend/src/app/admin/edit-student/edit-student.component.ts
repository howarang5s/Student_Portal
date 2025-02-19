import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/students/student.service'; 
import { AuthService } from 'src/app/auth/auth-service.service'; 
import { AdminService } from '../admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent {
  editStudentForm: FormGroup;
    teacherId: string = '';
    courses: string[] = ['Math', 'Science', 'English', 'History']; 
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private studentService: StudentService, 
      private authService: AuthService, 
      private router: Router, 
      private adminService: AdminService,
      private snackbar: SnackbarService
    ) {
      this.editStudentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['',Validators.required]
      });
    }
  
    ngOnInit(): void {
      
      this.teacherId = this.route.snapshot.paramMap.get('id') || '';
      this.populateForm();
    }
  
    populateForm() {
      if (this.teacherId) {
        
        this.adminService.getStudentById(this.teacherId).subscribe(
          (teacherData) => {
            this.editStudentForm.patchValue(teacherData);
          },
          (error) => {
            this.snackbar.showServiceFailureMessage('Error fetching student data:',error);
          }
        );
      }
    }
  
    onSubmit() {
      if (this.editStudentForm.valid) {
        
        const token = this.authService.getToken();
  
        if (!token) {
          this.snackbar.showErrorMessage('You must be logged in to update a student.')
          return;
        }
  
      
        const updatedTeacherData = this.editStudentForm.value;
  
        
        this.adminService.updateTeacher(this.teacherId, updatedTeacherData).subscribe(
          (response) => {
            this.snackbar.showSuccessMessage('Student Updated Successfully!');
            this.router.navigate(['/admin/students']);
          },
          (error) => {
            this.snackbar.showServiceFailureMessage('Error updating student:', error);
          }
        );
      } else {
        this.snackbar.showErrorMessage('Please fill out the form correctly.');
      }
    }
  
    onCancel() {
      
      this.snackbar.showDefaultMessage('Edit canceled.');
      this.router.navigate(['/admin/students']);
    }
}
