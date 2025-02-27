import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { AdminService } from '../admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  addCourseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {
    this.addCourseForm = this.fb.group({
      
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
    });
  }

  onSubmit() {

    if (this.addCourseForm.valid) {
      const courseData = this.addCourseForm.value;

      this.adminService.addCourse(courseData).subscribe(
        (response) => {
          this.snackbar.showSuccessMessage('Course added successfully!');
          this.router.navigate(['admin/courses']); 
        },
        (error) => {
          this.snackbar.showErrorMessage('There was an error adding the course. Please try again.');
        }
      );
    } else {
      this.snackbar.showErrorMessage('Please fill out the form correctly.');
    }
  }

  onCancel() {
    this.addCourseForm.reset();
    this.router.navigate(['/admin/courses']);
  }
}
