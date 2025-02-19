import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';  
import { AuthService } from '../auth.service'; 
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentByTeacherComponent implements OnInit {
  editStudentForm: FormGroup;
  studentId: string = '';
  subjects: string[] = ['Math', 'Science', 'English', 'History']; 
  grades: string[] = ['A+', 'A-', 'B+', 'B-', 'F']; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router,
    private snackbar: SnackbarService
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
          
          this.editStudentForm.patchValue(studentData);
        },
        (error) => {
          this.snackbar.showServiceFailureMessage('Error fetching student data:', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.editStudentForm.valid) {
      
      
      const token = this.authService.getToken();

      if (!token) {
        this.snackbar.showErrorMessage('You must be logged in to update a student.');
        return;
      }

    
      const updatedStudentData = this.editStudentForm.value;

      
      this.studentService.updateStudent(this.studentId, updatedStudentData).subscribe(
        (response) => {
          
          this.snackbar.showSuccessMessage('Student Updated Successfully');
          this.router.navigate(['student/portal']);
        },
        (error) => {
          this.snackbar.showServiceFailureMessage('Failed to update student. Please try again later.',error);
        }
      );
    } else {
      this.snackbar.showErrorMessage('Please fill out the form correctly.')
    }

  }
  onKey(event:any){
    
    console.log(event.target.value);
    let input:any = event.target.value;
    let grade = '';
    if (input > 0 && input <= 100){
      if(input > 0 && input <= 33){
        grade = 'F';
      }else if(input > 33 && input <= 60){
        grade = 'B-';
      }else if(input > 60 && input <= 79){
        grade = 'B+';
      }else if(input > 79 && input <= 89){
        grade = 'A-';
      }else if(input > 89 && input <= 100){
        grade = 'A+';
      } 
    }else{
      this.snackbar.showErrorMessage('Invaid Input');
    }
    this.editStudentForm.patchValue({
      grade:grade,
      
    });  
    
  }

  onCancel() {
    
    this.snackbar.showErrorMessage('Edit canceled.');
    this.router.navigate(['student/portal']);
  }
}
