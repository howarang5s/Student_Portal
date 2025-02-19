import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  isSuccessMessage: boolean = false;
  isErrorMessage: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
    },{ validators: this.passwordMatchValidator });
  }

  ngOnInit(){
    this.resetPasswordForm.valueChanges.subscribe(() => {
      
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    const { newPassword } = this.resetPasswordForm.value;
    const email:any = localStorage.getItem('resetemail');
    this.authService.forgotPassword(email,newPassword).subscribe(
      (response) => {
        this.isLoading = false;
        this.snackbar.showSuccessMessage('Password is Updated');
        localStorage.removeItem('resetemail')
        this.router.navigate(['auth/login']);
        
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error updating password';
        this.isErrorMessage = true;
      }
    );
  }
  
  
  
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
      const passwordControl = form.get('newPassword');
      const confirmPasswordControl = form.get('confirmPassword');
    
      if (!passwordControl || !confirmPasswordControl) return null;
    
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
    
      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ mismatch: true }); 
        return { mismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    }
}
