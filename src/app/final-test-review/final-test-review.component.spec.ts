import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalTestReviewComponent } from './final-test-review.component';

describe('FinalTestReviewComponent', () => {
  let component: FinalTestReviewComponent;
  let fixture: ComponentFixture<FinalTestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalTestReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalTestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
