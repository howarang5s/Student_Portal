import { Component, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';  
import { AdminService } from '../admin.service';
import { AuthService } from 'src/app/auth/auth-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/students/student.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
})
export class AddTeacherComponent {
  addTeacherForm: FormGroup;
  students = new MatTableDataSource<any>([]);
  user = new MatTableDataSource<any>([]);
  courses: string[] = ['Math', 'Science', 'English', 'History']; // Define subjects  
  users: string[] = [];
  selectedUser: string = '';
  hidePassword: boolean = true; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private adminService: AdminService, private authService: AuthService, private studentService: StudentService) {
    this.addTeacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
      subject: ['', Validators.required],
    });
  }

  ngOnInit() {
    // this.studentService.getUsers().pipe(map(
    //   (data: any) => {
    //     console.log('Users:', data);  
    //     if (Array.isArray(data)) {  
    //       this.user.data = data.map((user_data: any,index: number) => ({
    //         ...user_data,
            
    //         localId: index + 1
    //       }));
            
    //       this.users = this.user.data
    //         .filter((user) => user.role === 'teacher')  
    //         .map((user) => user.name);  

    //       console.log(this.users);
    //     } else {
    //       console.error('Received data is not an array:', data);
    //     }
    //   })
    // ).subscribe({
    //   next: (transformedData: any) => {
        
    //     console.log('Filtered Teachers Names:', this.users);
    //   },
    //   error:(error: any) => {
    //     console.error('Error fetching student data', error);
    //   }
    // });
  }

  onSubmit() {

    if (this.addTeacherForm.valid) {
      const teacherData = this.addTeacherForm.value;
      console.log('Teacher Data:', teacherData);

      
      this.adminService.addTeacher(teacherData).subscribe(
        (response) => {
          console.log('Teacher Added Successfully:', response);
          alert('Teacher Added Successfully!');
          this.router.navigate(['/dashboard']); 
        },
        (error) => {
          console.error('Error adding student:', error);
          alert('There was an error adding the student. Please try again.');
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
  change(event: any){
    if(event.isUserInput) {
      console.log(event.source.value);
      let setected:any = event.source.value;
      const email = this.user.data.find(obj=>obj.name === setected).email;
      console.log(email);
      this.addTeacherForm.patchValue({
        email:email
      });  
    }
  }

  onCancel() {
    this.addTeacherForm.reset();
    this.router.navigate(['/dashboard']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


}
