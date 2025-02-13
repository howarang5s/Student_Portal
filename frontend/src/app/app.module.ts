import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';  // Import MatTableModule for mat-table
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule for mat-select and mat-option
import { MatOption, MatOptionModule } from '@angular/material/core'; 
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { PortalComponent } from './students/portal/portal.component';
import { ProfileComponent } from './students/profile/profile.component';
import { AddStudentComponent } from './admin/add-student/add-student.component';
import { EditStudentComponent } from './admin/edit-student/edit-student.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './auth/register/register.component';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { EditTeacherComponent } from './admin/edit-teacher/edit-teacher.component';
import { TeacherProfileComponent } from './teacher/profile/profile.component';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmailVerificationDialogComponent } from './auth/email-verification-dialog/email-verification-dialog.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddTeacherComponent } from './admin/add-teacher/add-teacher.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';  // Import MatToolbarModule
import { MatButtonModule } from '@angular/material/button';    // If using buttons
import { AdminProfileComponent } from './admin/profile/profile.component';
import { EditAdminComponent } from './admin/edit-admin/edit-admin.component';
import { EditStudentByTeacherComponent } from './students/edit-student/edit-student.component';
import { AddStudentByTeacherComponent } from './students/add-student/add-student.component';






@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    EditStudentComponent,
    LoginComponent,
    PortalComponent,
    RegisterComponent,
    ProfileComponent,
    EditTeacherComponent,
    TeacherProfileComponent,
    ForgotPasswordComponent,
    EmailVerificationDialogComponent,
    VerifyComponent,
    DashboardComponent,
    AddTeacherComponent,
    AdminProfileComponent,
    EditAdminComponent,
    EditStudentByTeacherComponent,
    AddStudentByTeacherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    HttpClientModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    CommonModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatOptionModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
