import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';  // Assuming you have a service to interact with the backend
import { AuthService } from '../auth.service'; // Assuming you have an AuthService for handling token

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  editStudentForm: FormGroup;
  studentId: string = '';
  subjects: string[] = ['Math', 'Science', 'English', 'History']; // Define subjects
  grades: string[] = ['A+', 'A-', 'B+', 'B-', 'F']; // Define grades

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router 
  ) {
    this.editStudentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['',Validators.required],
      marks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subject: ['', Validators.required],
      grade: ['', Validators.required],
      profile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    this.populateForm();
  }

  populateForm() {
    if (this.studentId) {
      
      this.studentService.getStudentById(this.studentId).subscribe(
        (studentData) => {
          console.log(studentData);
          this.editStudentForm.patchValue(studentData);
        },
        (error) => {
          console.error('Error fetching student data:', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.editStudentForm.valid) {
      console.log('Updated Student Data:', this.editStudentForm.value);
      
      const token = this.authService.getToken();

      if (!token) {
        alert('You must be logged in to update a student.');
        return;
      }

    
      const updatedStudentData = this.editStudentForm.value;

      
      this.studentService.updateStudent(this.studentId, updatedStudentData).subscribe(
        (response) => {
          console.log('Student updated successfully:', response);
          alert('Student Updated Successfully!');
          this.router.navigate(['/portal']);
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
    this.router.navigate(['/portal']);
  }
}
