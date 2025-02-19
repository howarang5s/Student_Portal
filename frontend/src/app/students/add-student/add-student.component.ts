import { Component, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';  
import { StudentService } from '../student.service';
import { MatTableDataSource } from '@angular/material/table';
import { TeacherProfileService } from 'src/app/teacher/profile.service';
import { AdminService } from 'src/app/admin/admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentByTeacherComponent {
  addStudentForm: FormGroup;
  students = new MatTableDataSource<any>([]);
  user = new MatTableDataSource<any>([]);
  filteredUsers: string[] = [];
  student: string[] = [];
  subjects: string[] = ['Math', 'Science', 'English', 'History']; 
  grades: string[] = ['A+', 'A-', 'B+', 'B-', 'F']; 
  users: string[] = [];
  selectedUser: string = '';
  hidePassword: boolean = true; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private studentService: StudentService, private adminService: AdminService,private profileService: TeacherProfileService,private snackbar: SnackbarService) {
    this.addStudentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['',Validators.required],
      marks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subject: ['', Validators.required],
      grade: ['', Validators.required],
      profile: ['', Validators.required],
    });
  }

  ngOnInit() {
    
    this.studentService.getUsers().subscribe(
      (data)=>{
        console.log(data);
        this.user.data=data;
      }
    )
    this.studentService.getFilteredUsers().subscribe(
      (data)=>{
        console.log(data);
        this.users = data.students;
      }
    )
  }

  onSubmit() {

    if (this.addStudentForm.valid) {
      const studentData = this.addStudentForm.value;
      
      this.studentService.addStudent(studentData).subscribe(
        (response) => {
          
          this.snackbar.showSuccessMessage('Student Added Successfully');
          this.router.navigate(['student/portal']); 
        },
        (error) => {
          console.error('Error adding student:', error);
          this.snackbar.showServiceFailureMessage('There was an error adding the student. Please try again.',error);
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
      const userDetails = this.user.data.find(obj => obj.name === setected);
      const email = userDetails?.email;
      const subject = userDetails?.subject;

      console.log(email);
      this.addStudentForm.patchValue({
        email:email,
        subject:subject
      });  
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
    this.addStudentForm.patchValue({
      grade:grade,
      
    });  
    
  }

  onCancel() {
    this.addStudentForm.reset();
    this.snackbar.showDefaultMessage('Edit Cancelled')
    this.router.navigate(['student/portal']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
