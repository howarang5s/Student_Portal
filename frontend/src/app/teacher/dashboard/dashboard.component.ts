import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TeacherService } from '../teacher.service';
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
  totalPassedStudents: number = 0;
  totalFailedStudents: number = 0;
  teacherData: any = null;
  adminName: string = 'Admin';

  bestStudent: any = null; 
  lowestStudent: any = null; 

  constructor(private teacherService: TeacherService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.loadStudents();  
  }

  

  loadStudents() {
    this.teacherService.getDashboardStats().subscribe(
      (data)=>{
        
        this.totalPassedStudents = data.totalPassedStudents;
        this.totalFailedStudents = data.totalFailedStudents;
        this.bestStudent = data.bestStudent;
        this.lowestStudent = data.lowestStudent;
      }
    )
  }

  
  
}
