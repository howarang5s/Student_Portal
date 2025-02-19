import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { SharedModule } from '../shared/shared.module';


import { TeacherProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    TeacherProfileComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule 
  ]
})
export class TeacherModule {}
