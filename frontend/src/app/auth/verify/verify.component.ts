import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  email!: string; 
  otpForm: FormGroup; 
  isVerified = false;
  message = "Enter the OTP sent to your email.";
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || sessionStorage.getItem('email') || '';

    if (!this.email) {
      this.openDialog('Invalid email. Please request a new OTP.');
      this.router.navigate(['auth/forgot-password']);
    }
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.isLoading = true;

    this.authService.verifyOtp(this.email, this.otpForm.value.otp).subscribe({
      next: (response) => {
        console.log('response');
        this.isLoading = false;
        this.isVerified = true;
        this.message = "OTP verified successfully! Redirecting to login...";
        this.snackbar.showSuccessMessage(this.message);
        
        setTimeout(() => {
          this.router.navigate(['auth/login']);
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
        this.message = "Invalid or expired OTP. Please try again.";
        this.snackbar.showErrorMessage(this.message);
      }
    });
  }

  openDialog(message: string): void {
    this.dialog.open(EmailVerificationDialogComponent, {
      width: '350px',
      data: { message }
    });
  }
}


