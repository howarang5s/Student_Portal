import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { EditTeacherComponent } from './edit-teacher/edit-teacher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProfileComponent } from './profile/profile.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    AddStudentComponent,
    EditStudentComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    DashboardComponent,
    AdminProfileComponent,
    EditAdminComponent,
    SidebarComponent,
    NavbarComponent,
    StudentsListComponent,
    TeachersListComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule // Contains Angular Material imports
  ]
})
export class AdminModule {}
