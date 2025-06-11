import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalTestFeedbacksComponent } from './final-test-feedbacks.component';

describe('FinalTestFeedbacksComponent', () => {
  let component: FinalTestFeedbacksComponent;
  let fixture: ComponentFixture<FinalTestFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalTestFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalTestFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
