import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';

// Components
import { ProfileComponent } from './profile/profile.component';
import { StudentsLayoutComponent } from './students-layout/students-layout.component';


const routes: Routes = [
  {
      path: '',
      component: StudentsLayoutComponent, // Parent layout with sidebar and navbar
      children: [
        { path: 'dashboard', component: ProfileComponent,canActivate:[AuthGuardService] },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
