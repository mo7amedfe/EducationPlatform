import { UserService } from './../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assignment-feedbacks',
  imports: [FormsModule, CommonModule],
  templateUrl: './assignment-feedbacks.component.html',
  styleUrl: './assignment-feedbacks.component.css'
})
export class AssignmentFeedbacksComponent implements OnInit {
  feedbacks: any[] = [];
  selectedCourse: string = '';

private _UserService=inject(UserService)
  ngOnInit(): void {

    this._UserService.getAssignmentsFeedbacks().subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.feedbacks = Array.isArray(res.submissions) ? res.submissions : [];
        }
      });
  }

  get courses(): string[] {
    // Get unique course names for filter dropdown
    return [...new Set(this.feedbacks.map(f => f.courseName))];
  }

  get filteredFeedbacks(): any[] {
    if (!this.selectedCourse) return this.feedbacks;
    return this.feedbacks.filter(f => f.courseName === this.selectedCourse);
  }
}
