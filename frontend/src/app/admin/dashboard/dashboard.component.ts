import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  

  displayColumns: string[] = ['name', 'email', 'subject', 'date', 'actions'];
  displayColumnsforstudents: string[] = ['name', 'email','subject',  'date', 'actions'];
  totalTeachers: number = 0;
  totalStudents: number = 0;
  teacherData: any = null;
  adminName: string = 'Admin';

  bestStudent: any = null; 
  bestTeacher: any = null; 

  constructor(private adminService: AdminService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.loadStudents();  
  }

  

  loadStudents() {
    this.adminService.getCountStudents().subscribe(
      (data)=>{
        console.log(data);
        this.totalStudents = data.studentscount;
        this.totalTeachers = data.teachercount;
        this.bestStudent = data.topStudent;
        this.bestTeacher = data.topTeacher;
      }
    )
  }

  
  
}
