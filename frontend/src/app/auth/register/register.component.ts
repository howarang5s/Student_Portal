import { Component } from '@angular/core';
import { AbstractControl,AbstractControlOptions,FormBuilder, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';
  
  
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService, private dialog: MatDialog) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); 
    
  }

  ngOnInit(){
    this.registerForm.valueChanges.subscribe(() => {
      console.log("Form Errors:", this.registerForm.errors); 
      console.log("Confirm Password Errors:", this.registerForm.controls['confirmPassword'].errors);
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
  
  


  
  onRegister() {
    // this.registerForm.get('password')?.markAsTouched();
    // this.registerForm.get('confirmPassword')?.markAsTouched();
    // this.registerForm.updateValueAndValidity(); 

    console.log("Final Form Errors:", this.registerForm.errors); 

    // if (this.registerForm.valid) {
    //   console.log("Form is valid, proceeding with registration...");
    // } else {
    //   console.log("Form is invalid, please correct errors.");
    // }

    if (this.registerForm.valid) {
      const {name,email,password,confirmPassword,role} = this.registerForm.value;
      console.log('Registration Data:', name,email,password,confirmPassword,role);

      this.authService.register(name,email,password,role)
        .subscribe({
          next: (response) => {
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
            // if (role === 'student') {
            //   this.router.navigate(['/student/profile']);
            // } else {
            //   this.router.navigate(['/portal']);
            // }
          },
          error: (err) => {
            this.errorMessage = err.error.message || 'Registration failed. Please try again.';
          }
        });
    }
    
  }
}
