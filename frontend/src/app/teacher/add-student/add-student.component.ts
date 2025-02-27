import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';  
import { TeacherService } from '../teacher.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentByTeacherComponent implements OnInit {
  addStudentForm: FormGroup;
  students = new MatTableDataSource<any>([]);
  user = new MatTableDataSource<any>([]);
  users: any[] = []; 
  selectedUser: any = null;
  subject: string = ''; 
  hidePassword: boolean = true; 
  teacherId: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private teacherService: TeacherService,
    private snackbar: SnackbarService
  ) {
    this.addStudentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', Validators.required],
      marks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subjects: ['', Validators.required],
      grade: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }

  ngOnInit() {
    
    this.subject = this.route.snapshot.paramMap.get('subject') || '';
    
    let teacher:any = localStorage.getItem('loggedInUser');
    teacher = JSON.parse(teacher);
    this.teacherId = teacher._id;
    
    this.teacherService.getFilteredUsers(this.subject).subscribe(
      (data) => {
        

        if (data && Array.isArray(data.students)) {
          this.users = data.students; // Ensure correct data structure
        } else {
          console.error('Unexpected API Response Format:', data);
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.snackbar.showServiceFailureMessage('Failed to load students.', error);
      }
    );
  }

  change(event: any) {
    if (event.isUserInput) {
      
      
      // Find the selected student based on name
      const selectedStudent = this.users.find(user => user.name === event.source.value);
      

      if (selectedStudent) {
        this.selectedUser = selectedStudent;
        this.addStudentForm.patchValue({
          email: selectedStudent.email || '',
          subjects: this.subject
        });
      } else {
        console.error('Student not found in the list!');
      }
    }
  }

  onKey(event: any) {
    let input = event.target.value;
    let grade = '';

    if (input >= 0 && input <= 100) {
      if (input <= 33) grade = 'F';
      else if (input <= 60) grade = 'B-';
      else if (input <= 79) grade = 'B+';
      else if (input <= 89) grade = 'A-';
      else grade = 'A+';
    } else {
      this.snackbar.showErrorMessage('Invalid Input');
    }

    this.addStudentForm.patchValue({ grade: grade });
  }

  onSubmit() {
    if (this.addStudentForm.valid) {
      const studentData = this.addStudentForm.value;
      
      this.teacherService.addStudent(studentData).subscribe(
        (response) => {
          this.snackbar.showSuccessMessage('Student added successfully!');
          this.router.navigate(['/teacher/students_listing'],{
            queryParams: { subject: this.subject }
          }); 
        },
        (error) => {
          console.error('Error adding student:', error);
          this.snackbar.showServiceFailureMessage('There was an error adding the student. Please try again.', error);
        }
      );
    } else {
      this.snackbar.showErrorMessage('Please fill out the form correctly.');
    }
  }

  onCancel() {
    this.addStudentForm.reset();
    this.router.navigate(['/teacher/students_listing'],{
      queryParams: { subject: this.subject }
    }); 
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
