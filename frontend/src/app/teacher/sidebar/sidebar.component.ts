import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherProfileService } from '../profile.service';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  subjects: any[] = []; 
  dropdownOpen = false; 
  subjectsIds : any[] = [];

  constructor(
    private router: Router, 
    private teacherProfileService: TeacherProfileService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    
    this.teacherProfileService.getTeacherProfile().subscribe((data) => {
      this.subjectsIds = data.subjects || []; 
      this.subjectsIds.forEach((subjectId) => {
        if (!isNaN(Number(subjectId))) {
          this.adminService.getCourseByCourseId(subjectId).subscribe(
            (response) => {
              this.subjects.push(response.courseName);
            },
            (error) => {
              console.error(`Error fetching course with ID ${subjectId}:`, error);
              
            }
          );
        } else {
          
          this.subjects.push(subjectId);
        }
      });
      
      this.cdr.detectChanges(); 
    });
  }

  toggleDropdown() {
     
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.detectChanges(); 
  }
  

  getFlattenedSubjects() {
    
    return this.subjects.flatMap(subjectObj => subjectObj.subjects || []);
  }

  onSubjectSelect(subject: string) {
    this.router.navigate(['/teacher/students_listing'], { queryParams: { subject } });
  }
  
}
