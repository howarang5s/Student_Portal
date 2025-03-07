import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/students/student.service';  // Assuming you have a service to interact with the backend
import { AuthService } from 'src/app/auth/auth-service.service'; // Assuming you have an AuthService for handling token
import { AdminService } from '../admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.scss']
})
export class EditTeacherComponent implements OnInit {
  editTeacherForm: FormGroup;
  teacherId: string = '';
  courses: string[] = []; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router, 
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {
    this.editTeacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      subjects: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.teacherId = this.route.snapshot.paramMap.get('id') || '';
    this.populateForm();

    this.adminService.getCoursestoadd().subscribe(
      (response)=>{
          this.courses=response;
      },
      (error)=> {
        this.snackbar.showServiceFailureMessage('Error fetching student data:',error);
      }
    )
  }

  populateForm() {
    if (this.teacherId) {
      
      this.adminService.getTeacherById(this.teacherId).subscribe(
        (teacherData) => {
          this.editTeacherForm.patchValue(teacherData);
          
        },
        (error) => {
          this.snackbar.showServiceFailureMessage('Error fetching student data:',error);
        }
      );
    }
  }

  onSubmit() {
    if (this.editTeacherForm.valid) {
      
      const token = this.authService.getToken();

      if (!token) {
        this.snackbar.showErrorMessage('You must be logged in to update a student.');
        return;
      }

    
      const updatedTeacherData = this.editTeacherForm.value;

      
      this.adminService.updateTeacher(this.teacherId, updatedTeacherData).subscribe(
        (response) => {
          this.router.navigate(['/admin/teachers']);
        },
        (error) => {
          console.error('Error updating student:', error);
          this.snackbar.showErrorMessage('Failed to update student. Please try again later.');
        }
      );
    } else {
      this.snackbar.showErrorMessage('Please fill out the form correctly.');
    }

  }

  onCancel() {
    
    this.snackbar.showDefaultMessage('Edit canceled.');
    this.router.navigate(['/admin/teachers']);
  }
}
