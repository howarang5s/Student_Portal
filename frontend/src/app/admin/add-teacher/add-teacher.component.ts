import { Component, Type } from '@angular/core';
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
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
})
export class AddTeacherComponent {
  addTeacherForm: FormGroup;
  students = new MatTableDataSource<any>([]);
  user = new MatTableDataSource<any>([]);
  courses: string[] = ['Math', 'Science', 'English', 'History']; 
  users: string[] = [];
  selectedUser: string = '';
  hidePassword: boolean = true; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private adminService: AdminService, private authService: AuthService, private studentService: StudentService, private snackbar: SnackbarService) {
    this.addTeacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
      subject: ['', Validators.required],
    });
  }

  ngOnInit() {
    }

  onSubmit() {

    if (this.addTeacherForm.valid) {
      const teacherData = this.addTeacherForm.value;
      

      
      this.adminService.addTeacher(teacherData).subscribe(
        (response) => {
          
          this.snackbar.showSuccessMessage('Teacher Added Successfully');
          this.router.navigate(['/admin/teachers']); 
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
      console.log(event.source.value);
      let setected:any = event.source.value;
      const email = this.user.data.find(obj=>obj.name === setected).email;
      
      this.addTeacherForm.patchValue({
        email:email
      });  
    }
  }

  onCancel() {
    this.addTeacherForm.reset();
    this.router.navigate(['/admin/teachers']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


}
