import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {
  students = new MatTableDataSource<any>([]);  
  displayColumns: string[] = ['name', 'marks', 'subject', 'grade','date', 'actions'];
  topGrade: string = '';
  topPassedSubject: string = '';
  lowestGrade: string = '';
  mostFailedSubject: string = '';


  constructor(private studentService: StudentService, private router: Router, private snackbar:SnackbarService) {}

  ngOnInit() {
    this.studentService.getStudents().subscribe(
      (data) => {
        
  
        if (Array.isArray(data)) {  
          this.students.data = data.map((student_data: any,index: number) => ({
            ...student_data,
            localId: index + 1
          }));
          this.calculateStatistics();
          
        } else {
          this.snackbar.showServiceFailureMessage('Received data is not an array:', data);
        }
      },
      (error) => {
        this.snackbar.showServiceFailureMessage('Error fetching student data:', error);
      }
    );
  }
  

  editStudent(student: any) {
    this.router.navigate(['student/edit-student',student._id ]); 

  }

  deleteStudent(student: any) {
    this.studentService.deleteStudent(student._id).subscribe({
      next: () => { 
        
        this.students.data = this.students.data.filter(s => s.localId !== student.localId);
              
        this.students._updateChangeSubscription();

        this.calculateStatistics();
  
        this.snackbar.showSuccessMessage('Student deleted successfully');
      },
      error: (error) => {
        
        this.snackbar.showServiceFailureMessage('Failed to delete student. Please try again.',error);
      }
    });
  }
  
  
  

  calculateStatistics() {
    if (this.students.data.length === 0) return;

    
    this.topGrade = this.getTopGrade();

    
    this.topPassedSubject = this.getTopPassedSubject();

    
    this.lowestGrade = this.getLowestGrade();

    
    this.mostFailedSubject = this.getMostFailedSubject();
  }

  getLowestGrade(): string {
    const topGradeStudent = this.students.data.reduce((prev, current) => 
      (prev.grade > current.grade ? prev : current), 
      { grade: -Infinity } as any);
    return topGradeStudent.grade;
  }

  getGradeClass(grade: string): string {
    return grade === 'F' ? 'failed' : 'passed';
  }

  getTopPassedSubject(): string {
    const passedSubjects = this.students.data.filter(student => student.grade < 'F' && student.grade >= 'A');

    
    const subjectCounts = passedSubjects.reduce<{ [subject: string]: number }>((acc, student) => {
      if (!acc[student.subject]) {
        acc[student.subject] = 1; 
      } else {
        acc[student.subject]++; 
      }  
      return acc;
    }, {});

    
    let topSubject = '';
    let maxCount = 0;

  
    for (const [subject, count] of Object.entries(subjectCounts)) {
      if (count > maxCount) {
        topSubject = subject;
        maxCount = count;
      }
    }

    return topSubject;
  }

  

  getTopGrade(): string {
    const lowestGradeStudent = this.students.data.reduce((prev, current) => 
      (prev.grade < current.grade ? prev : current), 
      { grade: +Infinity } as any);
    return lowestGradeStudent.grade;
  }

  getMostFailedSubject(): string {
    const failedStudents = this.students.data.filter(student => student.grade === 'F');
    
    const subjectCounts = failedStudents.reduce<{ [subject: string]: number }>((acc, student) => {
      acc[student.subject] = (acc[student.subject] || 0) + 1;
      return acc;
    }, {});
    
    let mostFailedSubject = '';
    let maxFailures = 0;
    for (const [subject, count] of Object.entries(subjectCounts)) {
      if (count > maxFailures) {
        mostFailedSubject = subject;
        maxFailures = count;
      }
    }
    return mostFailedSubject;
  }
}
