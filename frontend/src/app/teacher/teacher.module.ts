import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { SharedModule } from '../shared/shared.module';


import { TeacherProfileComponent } from './profile/profile.component';
import { PortalComponent } from './portal/portal.component';
import { AddStudentByTeacherComponent } from './add-student/add-student.component';
import { EditStudentByTeacherComponent } from './edit-student/edit-student.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    TeacherProfileComponent,
    PortalComponent,
    AddStudentByTeacherComponent,
    EditStudentByTeacherComponent,
    SidebarComponent,
    NavbarComponent,
    TeacherLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule 
  ]
})
export class TeacherModule {}
