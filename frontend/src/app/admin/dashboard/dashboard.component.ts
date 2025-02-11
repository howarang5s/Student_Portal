import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from 'src/app/students/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedTab: string = 'dashboard';  // Controls which section to show
  teachers = new MatTableDataSource<any>([]);
  students = new MatTableDataSource<any>([]);
  displayColumns: string[] = ['name', 'email', 'course', 'date', 'actions'];
  displayColumnsforstudents: string[] = ['name', 'marks', 'subject', 'grade','date'];
  totalTeachers: number = 0;
  totalStudents: number = 0;
  adminName: string = 'Admin';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadStudents();
  }

  // Load Teachers
  loadTeachers() {
    this.adminService.getTeacher().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.teachers.data = data.map((teacher, index) => ({
            ...teacher,
            localId: index + 1,
          }));
          this.totalTeachers = this.teachers.data.length;
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data));
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching teachers:', error)
    );
  }

  // Load Students
  loadStudents() {
    this.adminService.getStudents().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.students.data = data.map((student, index) => ({
            ...student,
            localId: index + 1,
          }));
          this.totalStudents = this.students.data.length;
          localStorage.setItem('students', JSON.stringify(this.students.data));
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching students:', error)
    );
  }

  // Edit Teacher
  editTeacher(teacher: any) {
    this.router.navigate(['/edit-teacher', teacher._id]);
  }

  // Delete Teacher
  deleteTeacher(teacher: any) {
    const index = this.teachers.data.findIndex((t) => t.localId === teacher.localId);
    if (index !== -1) {
      this.adminService.deleteTeacher(teacher._id).subscribe({
        next: () => {
          this.teachers.data.splice(index, 1);
          this.teachers._updateChangeSubscription();
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data));
          alert('Teacher deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
          alert('Failed to delete teacher. Please try again.');
        },
      });
    }
  }

  // Change the active tab
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }
}
