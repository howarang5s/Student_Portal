import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification-dialog',
  templateUrl: './email-verification-dialog.component.html',
  styleUrls: ['./email-verification-dialog.component.scss']
})
export class EmailVerificationDialogComponent implements OnInit {
  countdown = 60;  
  isVerified = false;
  message = "A verification email has been sent to your email. Please verify within 1 minute. After validating click on verify email button.";
  showOkButton = false;
  timer: any;

  constructor(
    public dialogRef: MatDialogRef<EmailVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string, emailToken: string },
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timer);
        this.message = "Verification link expired. Please try again.";
      }
    }, 1000);
  }

  verifyEmail() {
    this.authService.verifyEmail(this.data.emailToken).subscribe({
      next: (response) => {
        console.log('Verify Email');
        clearInterval(this.timer);
        if (response.isVerifiedEmail) {
          console.log('Email Verification');
          this.isVerified = true;
          this.message = "Email verified successfully! You can now log in.";
        } else {
          this.message = "Email verification failed.";
        }
  
        this.showOkButton = true;
      },
      error: (err) => {
        console.error('Verification error:', err); // Log the error
        this.message = "Verification failed. Please try again.";
      }
    });
  }
  

  closeDialog() {
    this.dialogRef.close(this.isVerified);  // Send verification status back to parent
  }
}
