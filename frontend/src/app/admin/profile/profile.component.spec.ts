import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: AdminProfileComponent;
  let fixture: ComponentFixture<AdminProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProfileComponent]
    });
    fixture = TestBed.createComponent(AdminProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
