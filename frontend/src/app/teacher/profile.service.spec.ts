import { TestBed } from '@angular/core/testing';

import { TeacherProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: TeacherProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
