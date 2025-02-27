import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TeacherService } from '../teacher.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {
  students = new MatTableDataSource<any>([]);
  displayColumns: string[] = ['name','subject','marks','grade','date', 'actions']; // Updated columns
  selectedSubject: string = ''; // Store selected subject filter
  allStudents: any[] = []; // Store all students before filtering
  totalStudents: number = 0; // Total count for paginator
  currentPage: number = 1;
  recordsPerPage: number = 10;
  totalPages: number =0;
  sortField: string = '';
  sortOrder: string = ''

  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  @ViewChild(MatSort) sorter!:MatSort

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    // Get selected subject from query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedSubject = params['subject'] || '';
      this.loadStudents(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    });
  }

  ngAfterViewInit() {
    this.students.paginator = this.paginator;
    this.students.sort = this.sorter;

    
    this.sorter.sortChange.subscribe(() => {
      this.sortField = this.sorter.active;
      this.sortOrder = this.sorter.direction || 'asc';
      this.loadStudents(this.currentPage,this.recordsPerPage, this.sortField, this.sortOrder);
    });

    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex + 1;
      this.recordsPerPage = this.paginator.pageSize;
      this.loadStudents(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    });
  }

  loadStudents(currentPage: number, recordsPerPage: number, sortField: string, sortOrder: string) {
    this.teacherService.getStudents(this.selectedSubject,currentPage, recordsPerPage, sortField, sortOrder).subscribe(
      (data) => {
        console.log(data);
        this.students=data.students;
        this.totalStudents=data.totalStudents;
        this.currentPage=data.currentPage;
        this.totalPages=data.totalPages;

      },
      (error) => {
        this.snackbar.showServiceFailureMessage('Error fetching students:', error);
      }
    );
  }

  filterStudentsBySubject() {
    if (this.selectedSubject) {
      this.students.data = this.allStudents.filter(student =>
        student.subjects.includes(this.selectedSubject)
      );
      
    } else {
      this.students.data = this.allStudents; 
    }
  }

  editStudent(student: any) {
    this.router.navigate(['/teacher/edit-student', student._id], {
      queryParams: { subject: this.selectedSubject }
    });
  }
  

  deleteStudent(student: any) {
    this.teacherService.deleteStudent(student._id,this.selectedSubject).subscribe({
      next: () => {
        this.allStudents = this.allStudents.filter(s => s._id !== student._id);
        this.filterStudentsBySubject(); // Reapply filtering after deletion
        this.loadStudents(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
        this.snackbar.showSuccessMessage('Student deleted successfully');
      },
      error: (error) => {
        this.snackbar.showServiceFailureMessage('Failed to delete student. Please try again.', error);
      },
    });
  }

  refresh() {
    this.loadStudents(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder); // Reload data without full page refresh
  }
}
