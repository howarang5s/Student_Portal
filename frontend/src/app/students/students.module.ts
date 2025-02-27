import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from '../shared/shared.module';


import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudentsLayoutComponent } from './students-layout/students-layout.component';

@NgModule({
  declarations: [
    ProfileComponent,
    SidebarComponent,
    NavbarComponent,
    StudentsLayoutComponent 
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule 
  ],
  exports: [
  ]
})
export class StudentsModule {}
