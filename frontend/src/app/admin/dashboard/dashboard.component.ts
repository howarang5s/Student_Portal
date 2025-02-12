import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

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
  displayColumnsforstudents: string[] = ['name', 'marks', 'subject', 'grade', 'date'];
  totalTeachers: number = 0;
  totalStudents: number = 0;
  adminName: string = 'Admin';

  bestStudent: any = null; // Stores the student with the highest marks
  bestTeacher: any = null; // Stores the teacher with the highest number of students

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadStudentsAndFindBestTeacher();
  }

  

  // Load Teachers
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

          console.log('Teachers loaded. Now loading students...');
          
          // Load students first, then find the best teacher
          this.loadStudentsAndFindBestTeacher();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching teachers:', error)
    );
  }


  // Load Students
  loadStudentsAndFindBestTeacher() {
    this.adminService.getStudents().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.students.data = data.map((student, index) => ({
            ...student,
            localId: index + 1,
          }));
          this.totalStudents = this.students.data.length;
          localStorage.setItem('students', JSON.stringify(this.students.data));
  
          console.log('Students loaded. Now finding the best teacher...');
          
          // Now that students are loaded, find the best teacher
          this.findBestTeacher();
          this.findBestStudent();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching students:', error)
    );
  }
  

  // Find Best Student (Highest Marks)
  findBestStudent() {
    if (this.students.data.length > 0) {
      this.bestStudent = this.students.data.reduce((prev, curr) => 
        curr.marks > prev.marks ? curr : prev, this.students.data[0]
      );
    }
  }

  findBestTeacher() {
    console.log(this.students.data);
    if (this.teachers.filteredData.length > 0 && this.students.data.length > 0) {
      // Step 1: Count students for each teacher
      const teacherStudentCount: { [key: string]: number } = {};
  
      this.students.data.forEach((student) => {
        const teacherId = student.addedBy; // Assuming 'addedBy' contains the teacher's ID
        if (teacherId) {
          teacherStudentCount[teacherId] = (teacherStudentCount[teacherId] || 0) + 1;
        }
      });
  
      // Step 2: Find the teacher with the highest student count
      let bestTeacher = null;
      let maxCount = 0;
  
      this.teachers.data.forEach((teacher) => {
        const count = teacherStudentCount[teacher.userId] || 0; // Default to 0 if no students found
        console.log(`count of student across each id:${teacher._id}`,count);
        if (count > maxCount) {
          maxCount = count;
          bestTeacher = teacher;
        }
      });
      
      
      if(bestTeacher !== null){
        this.bestTeacher = bestTeacher;
      }else{
        this.bestTeacher = this.teachers.data[0];
      }
    }
  }
  

  // Edit Teacher
  editTeacher(teacher: any) {
    this.router.navigate(['/edit-teacher', teacher._id]);
  }

  // Delete Teacher
  deleteTeacher(teacher: any) {
    console.log('Lets del');
    const index = this.teachers.data.findIndex((t) => t.localId === teacher.localId);
    if (index !== -1) {
      console.log('Lets del');
      console.log(this.teachers);
      console.log(teacher._id);
      this.adminService.deleteTeacher(teacher._id).subscribe({
        next: () => {
          this.teachers.data.splice(index, 1);
          this.teachers._updateChangeSubscription();
          console.log(this.teachers);
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data));
          alert('Teacher deleted successfully!');

          this.findBestTeacher();
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
          alert('Failed to delete teacher. Please try again.');
        },
      });
    }
  }

  
  selectTab(tabName: string) {
    this.selectedTab = tabName;
    if (this.selectedTab === 'dashboard') {
      this.loadTeachers();
      this.loadStudentsAndFindBestTeacher();
    }
  }
}
