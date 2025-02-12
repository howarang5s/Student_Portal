import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

import { HttpHeaders } from '@angular/common/http';

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
    
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email,password).subscribe({
          next:(response)=>{
            console.log(response.user);
            if (!response.token) {
              console.error("No token received!");
              return;
            }

            console.log("Received Token:", response.token);
            this.authService.saveToken(response.token);
            this.authService.saveCurrentUser(response.user); 
            const userRole = response.user.role;
            if(response.user.isVerifiedEmail === false){
                alert('Please verify email..');
            }
            console.log('User Role',userRole);
            if (userRole === 'student' ) {
              this.router.navigate(['/student/profile']);

            }else if(userRole === 'admin'){
              this.router.navigate(['dashboard']);
            } else {
              this.router.navigate(['/portal']);
            }

            this.loading = false;
          },
          error:(err) => {
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
