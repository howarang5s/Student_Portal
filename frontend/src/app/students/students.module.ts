import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from '../shared/shared.module';


import { ProfileComponent } from './profile/profile.component';
import { AddStudentByTeacherComponent } from './add-student/add-student.component';
import { EditStudentByTeacherComponent } from './edit-student/edit-student.component';
import { PortalComponent } from './portal/portal.component';
@NgModule({
  declarations: [
    ProfileComponent,
    AddStudentByTeacherComponent,
    EditStudentByTeacherComponent,
    PortalComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule 
  ],
  exports: [
    AddStudentByTeacherComponent,
    EditStudentByTeacherComponent,
    PortalComponent
  ]
})
export class StudentsModule {}
