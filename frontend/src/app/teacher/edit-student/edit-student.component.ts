import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../teacher.service';  
import { AuthService } from 'src/app/auth/auth-service.service'; 
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentByTeacherComponent implements OnInit {
  editStudentForm: FormGroup;
  studentId: string = '';
  selectedSubject: string = '';
  subjects: string[] = ['Math', 'Science', 'English', 'History','Physics','Chemistry','Computer','Biology']; 
  grades: string[] = ['A+', 'A-', 'B+', 'B-', 'F']; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private teacherService: TeacherService, 
    private authService: AuthService, 
    private router: Router,
    private snackbar: SnackbarService,
    private adminService: AdminService
  ) {
    this.editStudentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['',Validators.required],
      marks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subject: ['', Validators.required],
      grade: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    this.selectedSubject = this.route.snapshot.queryParamMap.get('subject') || '';
    this.populateForm();
    
  }
  
  populateForm() {
    if (this.studentId && this.selectedSubject) {
      this.teacherService.getStudentById(this.studentId, this.selectedSubject).subscribe(
        (studentData) => {
          console.log(studentData);
  
              this.editStudentForm.patchValue({
                name: studentData.name,
                email: studentData.email,
                marks: studentData.marks,
                subject: studentData.subject,
                comments: studentData.comments
              });
            }
          ),
          (error:any) => {
            this.snackbar.showServiceFailureMessage('Error fetching student data:', error);
          }
        };
        console.log(this.editStudentForm);
      }
      
  
  onSubmit() {
    console.log(this.editStudentForm.valid);
    if (this.editStudentForm.valid) {
      
      
      const token = this.authService.getToken();

      if (!token) {
        this.snackbar.showErrorMessage('You must be logged in to update a student.');
        return;
      }

    
      const updatedStudentData = this.editStudentForm.value;
      console.log(updatedStudentData);
      
      this.teacherService.updateStudent(this.studentId, updatedStudentData,this.selectedSubject).subscribe(
        (response) => {
          
          
          this.router.navigate(['/teacher/students_listing'],{
            queryParams: { subject: this.selectedSubject }
          }); 
        },
        (error) => {
          console.error('Error fetching students:', error);
        this.snackbar.showServiceFailureMessage('Failed to load students.', error);
        }
      );
    } else {
      this.snackbar.showErrorMessage('Please fill out the form correctly.')
    }

  }
  onKey(event:any){
    
    
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
    this.router.navigate(['/teacher/students_listing'],{
      queryParams: { subject: this.selectedSubject }
    }); 
  }
}
