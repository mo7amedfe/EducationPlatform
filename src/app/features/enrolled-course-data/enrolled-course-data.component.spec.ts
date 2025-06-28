import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourseDataComponent } from './enrolled-course-data.component';

describe('EnrolledCourseDataComponent', () => {
  let component: EnrolledCourseDataComponent;
  let fixture: ComponentFixture<EnrolledCourseDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolledCourseDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledCourseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
