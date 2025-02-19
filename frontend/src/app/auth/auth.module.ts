import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';


import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';
import { EmailVerificationDialogComponent } from './email-verification-dialog/email-verification-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyComponent,
    EmailVerificationDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule 
  ]
})
export class AuthModule {}
