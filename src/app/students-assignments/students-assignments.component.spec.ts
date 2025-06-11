import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsAssignmentsComponent } from './students-assignments.component';

describe('StudentsAssignmentsComponent', () => {
  let component: StudentsAssignmentsComponent;
  let fixture: ComponentFixture<StudentsAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsAssignmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
