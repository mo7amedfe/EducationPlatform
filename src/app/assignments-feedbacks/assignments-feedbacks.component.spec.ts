import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsFeedbacksComponent } from './assignments-feedbacks.component';

describe('AssignmentsFeedbacksComponent', () => {
  let component: AssignmentsFeedbacksComponent;
  let fixture: ComponentFixture<AssignmentsFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
