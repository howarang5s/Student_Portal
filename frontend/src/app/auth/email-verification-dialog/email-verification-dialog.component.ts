import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-verification-dialog',
  templateUrl: './email-verification-dialog.component.html',
  styleUrls: ['./email-verification-dialog.component.scss']
})
export class EmailVerificationDialogComponent implements OnInit {
  countdown = 60;
  otp: string = ''; // Store the entered OTP
  isVerified = false;
  message = "An OTP has been sent to your email. Enter it below to verify.";
  showOkButton = false;
  isButtonDisabled = true; // Disable verify button until OTP is entered
  timer: any;

  constructor(
    public dialogRef: MatDialogRef<EmailVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
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
        this.isButtonDisabled = true;
        this.message = "OTP expired. Please request a new one.";
      }
    }, 1000);
  }

  verifyOTP() {
    if (!this.otp || this.otp.length !== 6) {
      this.message = "Please enter a valid 6-digit OTP.";
      return;
    }
  
    this.authService.verifyOtp(this.data.email, this.otp).subscribe({
      next: (response) => {
        clearInterval(this.timer);
        if (response.isVerified) {
          console.log(response.isVerified);
          this.isVerified = true;
          this.message = "OTP verified successfully!";
          this.showOkButton = true;
          this.isButtonDisabled = true; 
        } else {
          this.message = "Invalid OTP. Please try again.";
        }
      },
      error: () => {
        this.message = "OTP verification failed. Please try again.";
      }
    });
  }
  

  closeDialog() {
    console.log(this.isVerified);
    this.dialogRef.close(this.isVerified);
  }
}




