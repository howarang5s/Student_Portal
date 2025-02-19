import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-email-verification-dialog',
  templateUrl: './email-verification-dialog.component.html',
  styleUrls: ['./email-verification-dialog.component.scss']
})
export class EmailVerificationDialogComponent implements OnInit {
  countdown = 30;
  otp: string = ''; 
  isVerified = false;
  message = "An OTP has been sent to your email. Enter it below to verify.";
  showOkButton = false;
  isButtonDisabled = true; 
  timer: any;
  isResending:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<EmailVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
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
      this.snackbar.showErrorMessage(this.message);
      return;
    }
  
    this.authService.verifyOtp(this.data.email, this.otp).subscribe({
      next: (response) => {
        clearInterval(this.timer);
        this.isVerified = true;
        this.message = "OTP verified successfully!";
        this.snackbar.showSuccessMessage(this.message);
        this.showOkButton = true;
        this.isButtonDisabled = true; 
      },
      error: () => {
        this.message = "OTP verification failed. Please try again.";
        this.snackbar.showErrorMessage(this.message);
      }
    });
  }
  
  close(){
    localStorage.removeItem('resetemail')
    this.dialogRef.close();

  }

  closeDialog() {
    this.dialogRef.close(this.isVerified);
  }

  resend() {
    const email:any=localStorage.getItem('resetemail')
    this.authService.sendOTP(email).subscribe(
      (response)=>{
        this.snackbar.showSuccessMessage('Email sent successfully');
      }
    )
    setTimeout(() => {
      this.isResending = false;
      this.otp = ''; 
      this.countdown = 30; 
      this.startCountdown();
    }, 2000); 
  }
}




