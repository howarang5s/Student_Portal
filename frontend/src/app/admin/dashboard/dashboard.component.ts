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
  selectedTab: string = 'dashboard';  
  teachers = new MatTableDataSource<any>([]);
  students = new MatTableDataSource<any>([]);
  studs = new MatTableDataSource<any>([]);
  displayColumns: string[] = ['name', 'email', 'subject', 'date', 'actions'];
  displayColumnsforstudents: string[] = ['name', 'email','subject',  'date', 'actions'];
  totalTeachers: number = 0;
  totalStudents: number = 0;
  adminName: string = 'Admin';

  bestStudent: any = null; 
  bestTeacher: any = null; 

  constructor(private adminService: AdminService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadStudentsAndFindBestTeacher();
    this.loadStudents();
    
    // Get the tab from the URL (default to 'dashboard')
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'] || 'dashboard';
    });
  
    
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
          
          this.loadStudentsAndFindBestTeacher();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching teachers:', error)
    );
  }

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
          
          this.loadStudentsAndFindBestTeacher();
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      (error) => console.error('Error fetching teachers:', error)
    );
  }


  
  loadStudentsAndFindBestTeacher() {
    this.adminService.getStudentsByTeacher().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.studs.data = data.map((stud, index) => ({
            ...stud,
            localId: index + 1,
          }));
          
          
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
    if (this.studs.data.length > 0) {
      this.bestStudent = this.studs.data.reduce((prev, curr) => 
        curr.marks > prev.marks ? curr : prev, this.studs.data[0]
      );
      console.log(this.bestStudent);
    }
  }

  findBestTeacher() {
    if (this.teachers.filteredData.length > 0 && this.studs.data.length > 0) {
      const teacherStudentCount: { [key: string]: number } = {};      
      this.studs.data.forEach((student, index) => {
        const teacherId = student.addedBy; 
        if (teacherId) {
          teacherStudentCount[teacherId] = (teacherStudentCount[teacherId] || 0) + 1;
        }     
      });
  
      // Step 2: Find the teacher with the highest student count
      let bestTeacher = null;
      let maxCount = 0;
  
      this.teachers.data.forEach((teacher) => {
        const count = teacherStudentCount[teacher._id] || 0; // Get student count for teacher
        
        if (count > maxCount) {
          maxCount = count;
          bestTeacher = teacher;
        }
      });
  
      // Step 3: Assign the best teacher
      if (bestTeacher !== null) {
        this.bestTeacher = bestTeacher;
      } else {
        this.bestTeacher = this.teachers.data[0]; // Default to the first teacher if no best found
      }
      
    } else {
      console.log("No teachers or students found!");
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
      window.location.reload();
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
      window.location.reload();
    }
  }

  
  selectTab(tabName: string) {
    this.selectedTab = tabName;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
  }
}
