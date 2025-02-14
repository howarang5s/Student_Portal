import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    private dialog: MatDialog
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // newPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(10)]],
      // confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      console.log('Invalid form');
      return;
    }
  
    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;
    localStorage.setItem('resetemail', email);
    console.log(email);
  
    this.authService.sendOTP(email).subscribe({
      next: (response) => {
        console.log('Email sent successfully to:', response.email);
        this.isLoading = false;
  
        // Open dialog box
        const dialogRef = this.dialog.open(EmailVerificationDialogComponent, {
          width: '400px',
          disableClose: true,  // Prevent accidental closure
          data: { email } 
        });
  
        // After closing dialog, navigate if verified
        dialogRef.afterClosed().subscribe(verified => {
          if (verified) {
            this.router.navigate(['/reset-password']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error sending OTP';
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
