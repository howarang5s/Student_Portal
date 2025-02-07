import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProfileService } from '../profile.service';  // Import the ProfileService
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // For handling forms

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.scss']
})
export class EditTeacherComponent implements OnInit {
  teacherId: string = '';
  teacherForm: FormGroup;
  teacherData: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,  
    private profileService: TeacherProfileService,  
    private router: Router,  
    private fb: FormBuilder  
  ) {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    
    this.teacherId = this.route.snapshot.paramMap.get('id')!;
    this.fetchTeacherData();
  }

  
  fetchTeacherData() {
    this.isLoading = true;
    this.profileService.getTeacherProfile().subscribe(
      (data) => {
        this.teacherData = data;
        console.log(this.teacherData);
        this.teacherForm.patchValue(this.teacherData);  
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching teacher data';
        console.error(error);
      }
    );
  }

  
  onSubmit(): void {
    if (this.teacherForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedTeacherData = this.teacherForm.value;

    this.profileService.updateTeacherProfile(this.teacherId, updatedTeacherData).subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Teacher profile updated successfully');
        this.router.navigate(['/teacher/profile']);  // Navigate to profile view after update
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile. Please try again later.';
      }
    );
  }
  onCancel() {
    
    alert('Edit canceled.');
    this.router.navigate(['/portal']);
  }
}
