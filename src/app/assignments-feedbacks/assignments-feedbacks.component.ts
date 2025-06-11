import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-assignments-feedbacks',
  imports: [CommonModule],
  templateUrl: './assignments-feedbacks.component.html',
  styleUrls: ['./assignments-feedbacks.component.css']
})
export class AssignmentsFeedbacksComponent {
  assignmentFeedbacks = [
    {
      courseName: 'Scratch Jr',
      lessonTitle: 'Lesson 1: Introduction',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      rating: 5,
      feedback: 'Excellent work! Well done.'
    },
    {
      courseName: 'Python Basics',
      lessonTitle: 'Lesson 1: Variables',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      rating: 4,
      feedback: 'Good job, but try to add more comments next time.'
    },
    {
      courseName: 'Scratch Jr',
      lessonTitle: 'Lesson 2: Moving Characters',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      rating: null,
      feedback: null
    }
  ];

  selectedCourse: string = '';

  get courses() {
    return [...new Set(this.assignmentFeedbacks.map(f => f.courseName))];
  }

  get filteredFeedbacks() {
    if (!this.selectedCourse) return this.assignmentFeedbacks;
    return this.assignmentFeedbacks.filter(f => f.courseName === this.selectedCourse);
  }
}
