import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  teachers = new MatTableDataSource<any>([]);  
  displayColumns: string[] = ['name', 'email', 'course','date', 'actions'];


  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.getTeacher().subscribe(
      (data) => {
        console.log('Students:', data); 
  
        if (Array.isArray(data)) {  
          this.teachers.data = data.map((teachers_data: any,index: number) => ({
            ...teachers_data,
            localId: index + 1
          }));
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data));
          
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => {
        console.error('Error fetching student data', error);
      }
    );
  }
  

  editTeacher(teacher: any) {
    this.router.navigate(['/edit-student',teacher._id ]); 

  }

  deleteTeacher(teacher: any) {
    const index = this.teachers.data.findIndex((s) => s.localId === teacher.localId); 
  
    if (index !== -1) {
      
      this.adminService.deleteTeacher(teacher._id).subscribe({
        next: (response) => { 
          this.teachers.data.splice(index, 1);
          this.teachers._updateChangeSubscription(); 
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data)); 
          alert('Student deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        }
      
      });
      window.location.reload();
    } else {
      alert('Student not found.');
    }
    console.log('Now update the grades');
    
    
  }
  
}

