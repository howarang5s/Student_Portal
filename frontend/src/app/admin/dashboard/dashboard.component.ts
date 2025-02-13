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
  selectedTab: string = 'dashboard';  
  teachers = new MatTableDataSource<any>([]);
  students = new MatTableDataSource<any>([]);
  displayColumns: string[] = ['name', 'email', 'subject', 'date', 'actions'];
  displayColumnsforstudents: string[] = ['name', 'email','subject',  'date', 'actions'];
  totalTeachers: number = 0;
  totalStudents: number = 0;
  adminName: string = 'Admin';

  bestStudent: any = null; 
  bestTeacher: any = null; 

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadStudentsAndFindBestTeacher();
  }

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
          
          
          this.loadStudentsAndFindBestTeacher();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching teachers:', error)
    );
  }


  
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
          
          
          this.findBestTeacher();
          this.findBestStudent();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching students:', error)
    );
  }
  

  
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
      const teacherStudentCount: { [key: string]: number } = {};
  
      this.students.data.forEach((student) => {
        const teacherId = student.addedBy; 
        if (teacherId) {
          teacherStudentCount[teacherId] = (teacherStudentCount[teacherId] || 0) + 1;
        }
      });
  
      
      let bestTeacher = null;
      let maxCount = 0;
  
      this.teachers.data.forEach((teacher) => {
        const count = teacherStudentCount[teacher.userId] || 0; 
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
  

  
  editTeacher(teacher: any) {
    this.router.navigate(['/edit-teacher', teacher._id]);
  }

  
  deleteTeacher(teacher: any) {
    
    const index = this.teachers.data.findIndex((t) => t.localId === teacher.localId);
    if (index !== -1) {
      this.adminService.deleteTeacher(teacher._id).subscribe({
        next: () => {
          this.teachers.data.splice(index, 1);
          this.teachers._updateChangeSubscription();
          localStorage.setItem('teachers', JSON.stringify(this.teachers.data));
          alert('Teacher deleted successfully!');

          this.findBestTeacher();
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
          alert('You can not delete teacher becuase teacher have to delete his associated students, first.');
        },
      });
    }
  }

  editstudent(student: any) {
    this.router.navigate(['/edit-student', student._id]);
  }

  
  deletestudent(student: any) {
    console.log('Lets del');
    const index = this.students.data.findIndex((t) => t.localId === student.localId);
    if (index !== -1) {
      console.log(student._id);
      this.adminService.deleteStudent(student._id).subscribe({
        next: () => {
          this.students.data.splice(index, 1);
          console.log('Lets del',this.students.data);
          this.students._updateChangeSubscription();
          localStorage.setItem('students', JSON.stringify(this.students.data));
          alert('Teacher deleted successfully!');

          this.findBestTeacher();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('You can not delete student becuase student have to delete his associated students, first.');
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
