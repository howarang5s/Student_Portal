import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss']
})
export class TeachersListComponent {
  teachers = new MatTableDataSource<any>([]);
  teacher = new MatTableDataSource<any>([]);
  displayColumns: string[] = ['name', 'email', 'subject','date', 'actions'];
  totalTeachers: number = 0;
  currentPage: number = 1;
  recordsPerPage: number = 10;
  totalPages: number =0;
  sortField: string = '';
  sortOrder: string = ''

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  @ViewChild(MatSort) sorter!:MatSort

  constructor(private adminService: AdminService, private router: Router, private snackbar: SnackbarService) {}

  ngOnInit() {      
    this.loadTeachers(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    
  }

  ngAfterViewInit() {
    this.teachers.paginator = this.paginator;
    this.teachers.sort = this.sorter;

    
    this.sorter.sortChange.subscribe(() => {
      this.sortField = this.sorter.active;
      this.sortOrder = this.sorter.direction || 'asc';
      this.loadTeachers(this.currentPage,this.recordsPerPage, this.sortField, this.sortOrder);
    });

    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex + 1;
      this.recordsPerPage = this.paginator.pageSize;
      this.loadTeachers(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
    });
  }

  
  loadTeachers(currentPage: any, recordsPerPage: any, sortField:any, sortOrder:any) {
    this.adminService.getTeacher(currentPage, recordsPerPage,sortField,sortOrder).subscribe(
      (response: any) => {
        this.currentPage = response.currentPage;
        this.totalTeachers = response.totalTeachers;
        this.totalPages = response.totalPages;
        this.teachers = response.teachers;
        this.teachers.paginator = this.paginator;
        this.teachers.sort = this.sorter;

      },
      (error) => {
        console.error('Error fetching teachers:', error);
        this.snackbar.showServiceFailureMessage('Error fetching teachers:', error);
      }
    );
  }
  
  refresh(){
    window.location.reload();
  }  

  editTeacher(teacher: any) {
    this.router.navigate(['/admin/edit-teacher', teacher._id]);
  }

  deleteTeacher(teacher: any) {
    this.adminService.deleteTeacher(teacher._id).subscribe({
      next: () => {
        console.log(this.teachers);

        this.loadTeachers(this.currentPage,this.recordsPerPage,this.sortField,this.sortOrder);
        this.snackbar.showSuccessMessage('Teacher deleted successfully');

        

      },
      error: (error) => {
        console.error('Error deleting teacher:', error);
        this.snackbar.showErrorMessage('Error deleting teacher.');
      },
    });
  }
  
}
