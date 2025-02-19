import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';  
import { AdminService } from '../admin.service';
import { AuthService } from 'src/app/auth/auth-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/students/student.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  addStudentForm: FormGroup;
    students = new MatTableDataSource<any>([]);
    user = new MatTableDataSource<any>([]);
    courses: string[] = ['Math', 'Science', 'English', 'History']; 
    users: string[] = [];
    selectedUser: string = '';
    hidePassword: boolean = true; 
  
    constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private adminService: AdminService, private authService: AuthService, private studentService: StudentService, private snackbar: SnackbarService) {
      this.addStudentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8) ]],
        subject: ['', Validators.required],
      });
    }
  
    ngOnInit():void {}
  
    onSubmit() {
  
      if (this.addStudentForm.valid) {
        const teacherData = this.addStudentForm.value;
  
        
        this.adminService.addStudent(teacherData).subscribe(
          (response) => {
            
            this.snackbar.showSuccessMessage('Student Added Successfully')
            this.router.navigate(['admin/students']); 
          },
          (error) => {
            
            this.snackbar.showErrorMessage('There was an error adding the student. Please try again.');
          }
        );
      } else {
        this.snackbar.showErrorMessage('Please fill out the form correctly.');
        
      }
    }
    change(event: any){
      if(event.isUserInput) {
        let setected:any = event.source.value;
        const email = this.user.data.find(obj=>obj.name === setected).email;
        this.addStudentForm.patchValue({
          email:email
        });  
      }
    }
  
    onCancel() {
      this.addStudentForm.reset();
      this.router.navigate(['/admin/students']);
    }
  
    togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword;
    }
}
