import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components

import { TeacherProfileComponent } from './profile/profile.component';

const routes: Routes = [
  // { path: '', redirectTo: 'portal', pathMatch: 'full' },
  { path: 'profile', component: TeacherProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
