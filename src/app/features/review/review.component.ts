import { Component } from '@angular/core';
import { StudentsAssignmentsComponent } from "./students-assignments/students-assignments.component";
import { FinalTestReviewComponent } from "./final-test-review/final-test-review.component";

@Component({
  selector: 'app-review',
  imports: [StudentsAssignmentsComponent, FinalTestReviewComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

}
