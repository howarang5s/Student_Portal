import { Component, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';  
import { StudentService } from '../student.service';
import { AuthService } from '../auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { TeacherProfileService } from 'src/app/teacher/profile.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent {
  addStudentForm: FormGroup;
  students = new MatTableDataSource<any>([]);
  user = new MatTableDataSource<any>([]);
  subjects: string[] = ['Math', 'Science', 'English', 'History']; // Define subjects
  grades: string[] = ['A+', 'A-', 'B+', 'B-', 'F']; // Define grades
  users: string[] = [];
  selectedUser: string = '';
  hidePassword: boolean = true; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router, private studentService: StudentService, private authService: AuthService,private profileService: TeacherProfileService) {
    this.addStudentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      marks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subject: ['', Validators.required],
      grade: ['', Validators.required],
      profile: ['', Validators.required],
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
    //         .filter((user) => user.role === 'student')  
    //         .map((user) => user.name);  

    //       console.log(this.users);
    //     } else {
    //       console.error('Received data is not an array:', data);
    //     }
    //   })
    // ).subscribe({
    //   next: (transformedData: any) => {
        
    //     console.log('Filtered Student Names:', this.users);
    //   },
    //   error:(error: any) => {
    //     console.error('Error fetching student data', error);
    //   }
    // });
    let teacher = this.profileService.getTeacherProfile().subscribe(
      (response:any) => {
        console.log('Get Teacher:', response);
        this.addStudentForm.patchValue({
          subject:response.course
        })
        
      }
    )
    
    
  }

  onSubmit() {

    if (this.addStudentForm.valid) {
      const studentData = this.addStudentForm.value;
      console.log('Student Data:', studentData);

      
      this.studentService.addStudent(studentData).subscribe(
        (response) => {
          console.log('Student Added Successfully:', response);
          alert('Student Added Successfully!');
          this.router.navigate(['/portal']); 
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
  // change(event: any){
  //   if(event.isUserInput) {
  //     console.log(event.source.value);
  //     let setected:any = event.source.value;
  //     const email = this.user.data.find(obj=>obj.name === setected).email;
  //     console.log(email);
  //     this.addStudentForm.patchValue({
  //       email:email
  //     });  
  //   }
  // }

  onCancel() {
    this.addStudentForm.reset();
    this.router.navigate(['/portal']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
