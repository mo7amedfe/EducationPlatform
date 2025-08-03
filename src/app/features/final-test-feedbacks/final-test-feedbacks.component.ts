import { UserService } from './../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-final-test-feedbacks',
  imports: [CommonModule,FormsModule],

  templateUrl: './final-test-feedbacks.component.html',
  styleUrl: './final-test-feedbacks.component.css'
})
export class FinalTestFeedbacksComponent implements OnInit {

  private _UserService = inject(UserService);
  
  assignmentFeedbacks: any[] = [];
  selectedCourse: string = '';
  isLoading = true; // Add loading state

  ngOnInit(): void {
    this.isLoading = true;
    this._UserService.getFinalTestsFeedbacks().subscribe({
      next: (res: any) => {
        console.log(res);
        this.assignmentFeedbacks = res.submissions || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading feedbacks:', err);
        this.isLoading = false;
      }
    });
  }

  get courses() {
    return [...new Set(this.assignmentFeedbacks.map(f => f.courseName))];
  }

  get filteredFeedbacks() {
    if (!this.selectedCourse) return this.assignmentFeedbacks;
    return this.assignmentFeedbacks.filter(f => f.courseName === this.selectedCourse);
  }
}

