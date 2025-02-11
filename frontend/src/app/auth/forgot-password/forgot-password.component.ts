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
      newPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, newPassword } = this.forgotPasswordForm.value;

    
    this.authService.forgotPassword(email, newPassword).subscribe(
      (response) => {
        console.log("response",response);
        this.isLoading = false;
        this.authService.saveToken(response.token);
        const emailToken = response.emailToken
        
        const dialogRef = this.dialog.open(EmailVerificationDialogComponent, {
          width: '400px',
          data: { email, emailToken }
        });

        
        dialogRef.afterClosed().subscribe(verified => {
          if (verified) {
            this.router.navigate(['/login']);
          }
        });

        // this.successMessage = 'Password updated successfully!';
        this.isSuccessMessage = true;
        this.isErrorMessage = false;
        
        setTimeout(() => this.router.navigate(['/login']),1000);
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error updating password';
        this.isErrorMessage = true;
        this.isSuccessMessage = false;
      }
    );
    
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
