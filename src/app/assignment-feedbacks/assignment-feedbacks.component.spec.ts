import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentFeedbacksComponent } from './assignment-feedbacks.component';

describe('AssignmentFeedbacksComponent', () => {
  let component: AssignmentFeedbacksComponent;
  let fixture: ComponentFixture<AssignmentFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
