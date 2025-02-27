import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentByTeacherComponent } from './edit-student.component';

describe('EditStudentByTeacherComponent', () => {
  let component: EditStudentByTeacherComponent;
  let fixture: ComponentFixture<EditStudentByTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStudentByTeacherComponent]
    });
    fixture = TestBed.createComponent(EditStudentByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
