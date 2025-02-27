import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit {
  adminId: string = '';
  adminForm: FormGroup;
  adminData: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,  
    private adminService: AdminService,  
    private router: Router,  
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {
    this.adminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    
    this.adminId = this.route.snapshot.paramMap.get('id')!;
    this.fetchAdminData();
  }

  
  fetchAdminData() {
    this.isLoading = true;
    this.adminService.getProfile().subscribe(
      (data) => {
        this.adminData = data;
        
        this.adminForm.patchValue(this.adminData);  
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching admin data';
        this.snackbar.showServiceFailureMessage(this.errorMessage,error);
    
      }
    );
  }

  
  onSubmit(): void {
    if (this.adminForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedAdminData = this.adminForm.value;

    this.adminService.updateProfile(this.adminId, updatedAdminData).subscribe(
      (response) => {
        this.isLoading = false;

        this.router.navigate(['/admin/profile']);  
      },
      (error) => {
        this.isLoading = false;
        
        this.errorMessage = 'Failed to update profile. Please try again later.';
        this.snackbar.showServiceFailureMessage(this.errorMessage,error);
      }
    );
  }
  onCancel() {
    
    this.snackbar.showDefaultMessage('Edit canceled.');
    this.router.navigate(['admin/profile']);
  }
}
