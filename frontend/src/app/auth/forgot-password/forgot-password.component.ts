import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
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
    private snackbar : SnackbarService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      
      return;
    }
  
    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;
    localStorage.setItem('resetemail', email);
    
  
    this.authService.sendOTP(email).subscribe({
      next: (response) => {
        this.snackbar.showSuccessMessage('Email sent successfully');
        this.isLoading = false;
  
        
        const dialogRef = this.dialog.open(EmailVerificationDialogComponent, {
          width: '400px',
          disableClose: false,  
          data: { email } 
        });
  
        
        dialogRef.afterClosed().subscribe(verified => {
          if (verified) {
            this.router.navigate(['auth/reset-password']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error sending OTP';
        this.snackbar.showServiceFailureMessage('Error sending OTP',error.error.message);
        this.isErrorMessage = true;
      }
    });
  }
  
  
  
  
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
      const passwordControl = form.get('password');
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
