import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent {
  courses = new MatTableDataSource<any>([]);
  displayColumnsforstudents: string[] = ['id', 'name','date', 'actions'];
  totalCourses: number = 0;
  currentPage: number = 1;
  recordsPerPage: number = 10;
  totalPages: number =0;
  sortField: string = '';
  sortOrder: string = ''

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  @ViewChild(MatSort) sorter!:MatSort

  constructor(private adminService: AdminService, private router: Router, private snackbar: SnackbarService) {}

  ngOnInit() {      
    this.loadCourses(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    
  }

  ngAfterViewInit() {
    this.courses.paginator = this.paginator;
    this.courses.sort = this.sorter;

    
    this.sorter.sortChange.subscribe(() => {
      this.sortField = this.sorter.active;
      this.sortOrder = this.sorter.direction || 'asc';
      this.loadCourses(this.currentPage,this.recordsPerPage, this.sortField, this.sortOrder);
    });

    
    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex + 1;
      this.recordsPerPage = this.paginator.pageSize;
      this.loadCourses(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    });
  }

  loadCourses(currentPage: number, recordsPerPage: number, sortField: string, sortOrder: string) {
    this.adminService.getCourses(currentPage, recordsPerPage, sortField, sortOrder).subscribe(
      (data: any) => {
  
        this.currentPage = data.currentPage;
        this.totalCourses = data.totalCourse; 
        this.totalPages = data.totalPages;
  
        this.courses = data.courses;
  
        this.courses.paginator = this.paginator;
        this.courses.sort = this.sorter;
  
        
      },
      (error) => {
        this.snackbar.showServiceFailureMessage('Error fetching students:', error);
      }
    );
  }

  refresh() {
    this.currentPage = 1;
    this.recordsPerPage = 10;
    let sortOrder = this.sorter.direction === 'desc' ? -1 : 1; 
    this.sortOrder = sortOrder.toString();
    this.sortField = 'id';
    this.loadCourses(this.currentPage, this.recordsPerPage, this.sortField, this.sortOrder);
  }
  editStudent(course: any) {
    
    this.router.navigate(['/admin/edit-course', course.courseId]);
  }

  deleteStudent(course: any) {
    this.adminService.deleteCourse(course.courseId).subscribe({
      next: (response) => {

        this.loadCourses(this.currentPage, this.recordsPerPage, this.sortField, this.sortOrder);
  
        this.snackbar.showSuccessMessage('Course deleted successfully!');

      },
      error: (error) => {
        this.snackbar.showServiceFailureMessage('Error deleting student:', error);
      },
    });
  }
}
