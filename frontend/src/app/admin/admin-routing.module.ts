import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // Parent layout with sidebar and navbar
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-student', component: AddStudentComponent },
      { path: 'edit-student/:id', component: EditStudentComponent },
      { path: 'students', component: StudentsListComponent },
      { path: 'add-teacher', component: AddTeacherComponent },
      { path: 'edit-teacher/:id', component: EditTeacherComponent },
      { path: 'teachers', component: TeachersListComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'edit-admin/:id', component: EditAdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
