import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/students/student.service';  // Assuming you have a service to interact with the backend
import { AuthService } from 'src/app/auth/auth-service.service'; // Assuming you have an AuthService for handling token
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.scss']
})
export class EditTeacherComponent implements OnInit {
  editTeacherForm: FormGroup;
  teacherId: string = '';
  courses: string[] = ['Math', 'Science', 'English', 'History']; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router, 
    private adminService: AdminService
  ) {
    this.editTeacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      course: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    
    this.teacherId = this.route.snapshot.paramMap.get('id') || '';
    this.populateForm();
  }

  populateForm() {
    if (this.teacherId) {
      
      this.adminService.getTeacherById(this.teacherId).subscribe(
        (teacherData) => {
          console.log(teacherData);
          this.editTeacherForm.patchValue(teacherData);
        },
        (error) => {
          console.error('Error fetching student data:', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.editTeacherForm.valid) {
      console.log('Updated Student Data:', this.editTeacherForm.value);
      
      const token = this.authService.getToken();

      if (!token) {
        alert('You must be logged in to update a student.');
        return;
      }

    
      const updatedTeacherData = this.editTeacherForm.value;

      
      this.adminService.updateTeacher(this.teacherId, updatedTeacherData).subscribe(
        (response) => {
          console.log('Student updated successfully:', response);
          alert('Student Updated Successfully!');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error updating student:', error);
          alert('Failed to update student. Please try again later.');
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }

  }

  onCancel() {
    
    alert('Edit canceled.');
    this.router.navigate(['/dashboard']);
  }
}
