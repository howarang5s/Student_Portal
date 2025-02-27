import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
// Layout Component
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { EditTeacherComponent } from './edit-teacher/edit-teacher.component';
import { AdminProfileComponent } from './profile/profile.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { CourseListComponent } from './course-list/course-list.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // Parent layout with sidebar and navbar
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuardService] },
      { path: 'add-student', component: AddStudentComponent, canActivate:[AuthGuardService] },
      { path: 'edit-student/:id', component: EditStudentComponent, canActivate:[AuthGuardService] },
      { path: 'students', component: StudentsListComponent, canActivate:[AuthGuardService] },
      { path: 'add-teacher', component: AddTeacherComponent, canActivate:[AuthGuardService] },
      { path: 'edit-teacher/:id', component: EditTeacherComponent, canActivate:[AuthGuardService] },
      { path: 'courses', component: CourseListComponent, canActivate:[AuthGuardService] },
      { path: 'add-course', component: AddCourseComponent, canActivate:[AuthGuardService] },
      { path: 'edit-course/:id', component: EditCourseComponent, canActivate:[AuthGuardService] },
      { path: 'teachers', component: TeachersListComponent, canActivate:[AuthGuardService] },
      { path: 'profile', component: AdminProfileComponent, canActivate:[AuthGuardService] },
      { path: 'edit-admin/:id', component: EditAdminComponent, canActivate:[AuthGuardService] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
