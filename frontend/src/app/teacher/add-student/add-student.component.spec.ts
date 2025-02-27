import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentByTeacherComponent } from './add-student.component';

describe('AddStudentByTeacherComponent', () => {
  let component: AddStudentByTeacherComponent;
  let fixture: ComponentFixture<AddStudentByTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStudentByTeacherComponent]
    });
    fixture = TestBed.createComponent(AddStudentByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
