import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PortalComponent } from './students/portal/portal.component';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './students/profile/profile.component';
import { TeacherProfileComponent } from './teacher/profile/profile.component';
import { EditTeacherComponent } from './admin/edit-teacher/edit-teacher.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddTeacherComponent } from './admin/add-teacher/add-teacher.component';
import { AdminProfileComponent } from './admin/profile/profile.component';
import { EditAdminComponent } from './admin/edit-admin/edit-admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'edit-student/:id', component: EditStudentComponent }, 
  { path: 'student/profile' , component: ProfileComponent},
  { path: 'teacher/profile' , component: TeacherProfileComponent},
  // { path: 'edit-teacher/:id' , component: EditTeacherComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'verify/:token', component: VerifyComponent },
  { path: 'dashboard',component:DashboardComponent},
  { path: 'add-teacher', component: AddTeacherComponent},
  { path: 'edit-teacher/:id', component: EditTeacherComponent},
  { path: 'admin/profile',component: AdminProfileComponent},
  { path: 'edit-admin/:id', component: EditAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
