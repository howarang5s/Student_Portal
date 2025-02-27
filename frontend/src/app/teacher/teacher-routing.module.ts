import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';



import { TeacherProfileComponent } from './profile/profile.component';
import { PortalComponent } from './portal/portal.component';
import { AddStudentByTeacherComponent } from './add-student/add-student.component';
import { EditStudentByTeacherComponent } from './edit-student/edit-student.component';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent, 
    children: [
      { path: 'profile', component: TeacherProfileComponent,canActivate:[AuthGuardService] },
      { path: 'dashboard' , component: DashboardComponent, canActivate:[AuthGuardService]},
      { path: 'students_listing',component: PortalComponent, canActivate:[AuthGuardService]},
      { path: 'add-student/:subject', component: AddStudentByTeacherComponent, canActivate:[AuthGuardService]},
      { path: 'edit-student/:id', component: EditStudentByTeacherComponent, canActivate:[AuthGuardService]},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
