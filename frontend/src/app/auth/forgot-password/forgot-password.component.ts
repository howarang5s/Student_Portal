import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/students/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(10)]]
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
  
}
