import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  email!: string; // Store user email
  otpForm: FormGroup; // OTP input form
  isVerified = false;
  message = "Enter the OTP sent to your email.";
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
  }

  ngOnInit(): void {
    // Get email from route params or session storage
    this.email = this.route.snapshot.queryParamMap.get('email') || sessionStorage.getItem('email') || '';

    if (!this.email) {
      this.openDialog('Invalid email. Please request a new OTP.');
      this.router.navigate(['/forgot-password']);
    }
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.isLoading = true;

    this.authService.verifyOtp(this.email, this.otpForm.value.otp).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isVerified = true;
        this.message = "OTP verified successfully! Redirecting to login...";
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
        this.message = "Invalid or expired OTP. Please try again.";
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


