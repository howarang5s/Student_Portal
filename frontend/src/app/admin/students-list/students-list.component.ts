import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  students = new MatTableDataSource<any>([]);
  displayColumnsforstudents: string[] = ['name', 'email', 'subject', 'date', 'actions'];
  totalStudents: number = 0;
  currentPage: number = 1;
  recordsPerPage: number = 10;
  totalPages: number =0;
  sortField: string = '';
  sortOrder: string = ''

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  @ViewChild(MatSort) sorter!:MatSort

  constructor(private adminService: AdminService, private router: Router, private snackbar: SnackbarService) {}

  ngOnInit() {      
    this.loadStudents(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    
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
    this.adminService.getStudents(currentPage, recordsPerPage, sortField, sortOrder).subscribe(
      (data: any) => {
        
  
        this.currentPage = data.currentPage;
        this.totalStudents = data.totalStudents; 
        this.totalPages = data.totalPages;
  
        this.students = data.enrichedStudents;
  
        this.students.paginator = this.paginator;
        this.students.sort = this.sorter;
  
        
      },
      (error) => {
        this.snackbar.showServiceFailureMessage('Error fetching students:', error);
      }
    );
  }
  
  refresh() {
    this.currentPage = 1;
    this.recordsPerPage = 10;
    let sortOrder = this.sorter.direction === 'desc' ? -1 : 1; // Convert to 1 or -1
    this.sortOrder = sortOrder.toString();
    this.sortField = 'name';
    this.loadStudents(this.currentPage, this.recordsPerPage, this.sortField, this.sortOrder);
  }
  
  

  editStudent(student: any) {
    this.router.navigate(['/admin/edit-student', student._id]);
  }

  deleteStudent(student: any) {
    this.adminService.deleteStudent(student._id).subscribe({
      next: (response) => {

        this.loadStudents(this.currentPage, this.recordsPerPage, this.sortField, this.sortOrder);
  
        this.snackbar.showSuccessMessage('Student deleted successfully!');

      },
      error: (error) => {
        this.snackbar.showServiceFailureMessage('Error deleting student:', error);
      },
    });
  }
  
  
  
}
