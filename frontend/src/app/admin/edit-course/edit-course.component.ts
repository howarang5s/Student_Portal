import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/students/student.service'; 
import { AuthService } from 'src/app/auth/auth-service.service'; 
import { AdminService } from '../admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent {
  editCourseForm: FormGroup;
  courseId:string='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router, 
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {
    this.editCourseForm = this.fb.group({
      courseId: ['',Validators.required],
      name: ['', [Validators.required, Validators.minLength(4)]],
      
    });
  }

  ngOnInit(): void {
      
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.populateForm();
  }

  populateForm() {
    if (this.courseId) {
      
      this.adminService.getCourseByCourseId(this.courseId).subscribe(
        (courseData) => {
          
          this.editCourseForm.patchValue({
            courseId:courseData.courseId,
            name:courseData.courseName
          });

        },
        (error) => {
          this.snackbar.showServiceFailureMessage('Error fetching student data:',error);
        }
      );
    }
  }

  onSubmit() {
    if (this.editCourseForm.valid) {
      
      const token = this.authService.getToken();

      if (!token) {
        this.snackbar.showErrorMessage('You must be logged in to update a student.')
        return;
      }

    
      const updatedCourseData = this.editCourseForm.value;

      
      this.adminService.updateCourse(updatedCourseData,this.courseId).subscribe(
        (response) => {
          this.router.navigate(['/admin/courses']);
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
      
    this.router.navigate(['/admin/courses']);
  }
}
