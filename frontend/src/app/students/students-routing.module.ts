import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ProfileComponent } from './profile/profile.component';
import { AddStudentByTeacherComponent } from './add-student/add-student.component';
import { EditStudentByTeacherComponent } from './edit-student/edit-student.component';
import { PortalComponent } from './portal/portal.component';

const routes: Routes = [
  
  { path: 'profile', component: ProfileComponent },
  { path: 'add-student', component: AddStudentByTeacherComponent },  
  { path: 'edit-student/:id', component: EditStudentByTeacherComponent},
  { path: 'portal',component:PortalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
