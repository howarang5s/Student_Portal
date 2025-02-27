import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ɵparseCookieValue } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = ''; 
  loading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {

    window.addEventListener("storage", (event) => {
      if (event.key === "forceLogout") {
        const currentSession:any = localStorage.getItem("sessionID");
        console.log(event.newValue);
        if (event.newValue !== currentSession) {
          console.log("Detected forced logout for current session. Redirecting...");
          this.logoutAndRedirect(); 
        }
      }
    });
  }
  
  
  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
  
      try {
        this.authService.login(email, password).subscribe({
          next: async (response) => {
            if (response.sessionID) {
              console.log('New session',response.sessionID);
              localStorage.setItem("sessionID", response.sessionID);
  
              if (response.oldSessionID) {
                console.log('Old session',response.oldSessionID);
                localStorage.setItem("forceLogout", response.oldSessionID);
                this.logoutAndRedirect();
              }
            }
  
            this.handleLoginSuccess(response);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || "Login failed. Please try again.";
            this.snackbar.showErrorMessage(this.errorMessage);
            this.loading = false;
          },
        });
      } catch (error) {
        console.error("Login Error:", error);
      }
    }
  }
  
  handleLoginSuccess(response: any) {
    if (!response.token) {
      this.snackbar.showErrorMessage("No token received!");
      return;
    }
  
    this.authService.saveToken(response.token);
    this.authService.saveCurrentUser({
      ...response.user,
      sessionID: response.sessionID,
    });

    const userRole = response.user.role;
    if (userRole === "student") {
      this.router.navigate(["/student/dashboard"]);
    } else if (userRole === "admin") {
      this.router.navigate(["/admin/dashboard"]);
    } else {
      this.router.navigate(["/teacher/dashboard"]);
    }
  
    this.loading = false;
  }
  
  checkSession() {
    const sessionID = localStorage.getItem("sessionID");
    let user:any = localStorage.getItem('loggedInUser');
    console.log(user);
    const userId = JSON.parse(user._id)
    if (userId) {
      this.authService.checkActiveSession(userId).subscribe((isValid) => {
        if (!isValid) {
          console.warn("Session expired or logged out. Redirecting to login.");
          
        }
      });
    }
  }

  logoutAndRedirect() {
    const oldSessionID = localStorage.getItem("forceLogout"); // ID from backend
    const currentSessionID = localStorage.getItem("sessionID"); // Current session

    console.log("Old session ID to logout:", oldSessionID);
    console.log("Current session ID:", currentSessionID);

    
    if (oldSessionID && oldSessionID !== currentSessionID) {
        console.log("Forcing logout for old session...");

        this.authService.logout(oldSessionID).subscribe(() => {
          
            if (localStorage.getItem("sessionID") === oldSessionID) {
                localStorage.clear();
                this.router.navigate(["/auth/login"]);
            }
        });
    }
  }

  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
