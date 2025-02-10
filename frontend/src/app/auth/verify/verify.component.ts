import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EmailVerificationDialogComponent } from '../email-verification-dialog/email-verification-dialog.component';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          this.openDialog('Email verified successfully! You can now login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.openDialog('Verification failed! The link may be invalid or expired.');
          this.router.navigate(['/register']);
        }
      });
    }
  }

  openDialog(message: string): void {
    this.dialog.open(EmailVerificationDialogComponent, {
      width: '350px',
      data: { message }
    });
  }
}
