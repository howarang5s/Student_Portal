import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';  // Import MatTableModule for mat-table
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule for mat-select and mat-option
import { MatOptionModule } from '@angular/material/core'; 
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { PortalComponent } from './students/portal/portal.component';
import { ProfileComponent } from './students/profile/profile.component';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './auth/register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { EditTeacherComponent } from './teacher/edit-teacher/edit-teacher.component';
import { TeacherProfileComponent } from './teacher/profile/profile.component';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component'; 



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
    ForgotPasswordComponent
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
    CommonModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
