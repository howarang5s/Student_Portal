import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = ''; 
  loading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
    
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
    });
  }

  ngOnInit():void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email,password).subscribe({
          next:(response)=>{
            
            if (!response.token) {
              this.snackbar.showErrorMessage("No token received!");
              return;
            }
            
            this.authService.saveToken(response.token);
            this.authService.saveCurrentUser(response.user); 
            const userRole = response.user.role;
            
            
            if (userRole === 'student' ) {
              
              this.router.navigate(['/student/profile']);

            }else if(userRole === 'admin'){
              
              this.router.navigate(['/admin/dashboard']);
            } else {
              
              this.router.navigate(['/student/portal']);
            }
            this.snackbar.showSuccessMessage('User Logins Successfully');

            this.loading = false;
          },
          error:(err) => {
            this.snackbar.showServiceFailureMessage('Try Again',err);
            this.errorMessage = err.error.message || 'Login failed. Please try again.';
            this.loading = false;
          }
        });
    }
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
