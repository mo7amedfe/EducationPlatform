import { ReviewService } from './../services/review.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-final-test-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './final-test-review.component.html',
  styleUrl: './final-test-review.component.css',
})
export class FinalTestReviewComponent implements OnInit {
  private _ReviewService = inject(ReviewService);

  allSubmissions: any[] = [];
  submissions: any[] = [];
  courses: { courseId: string; courseName: string }[] = [];
  selectedCourse: string = '';
  isLoading = true; // Add loading state

  ngOnInit(): void {
    this.isLoading = true; // Set loading to true on init
    this.loadSubmissions();
  }

  loadSubmissions() {
    this._ReviewService.getFinalTestSubmissions().subscribe({
      next: (res: any) => {
        console.log(res);

        this.allSubmissions = res.submissions;
        console.log('All Submissions:', this.allSubmissions);

        const courseMap: { [key: string]: string } = {};
        this.allSubmissions.forEach((sub: any) => {
          const course = sub.finalTestId.courseId;
          courseMap[course._id] = course.title;
        });

        this.courses = Object.entries(courseMap).map(
          ([courseId, courseName]) => ({ courseId, courseName })
        );

        if (this.courses.length > 0) {
          this.selectedCourse = this.courses[0].courseId;
          this.selectedCourse = '';
          this.updateSubmissions();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching submissions:', err);
        this.isLoading = false;
      },
    });
  }

  updateSubmissions() {
    if (!this.selectedCourse) {
      this.submissions = this.allSubmissions;
    } else {
      this.submissions = this.allSubmissions.filter(
        (sub) => sub.finalTestId.courseId._id === this.selectedCourse
      );
    }
  }

  onCourseChange() {
    this.updateSubmissions();
  }

  downloadSubmission(submission: any) {
    let submissionId = submission._id;
    this._ReviewService.downloadFinalTestSubmission(submissionId).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = submission.file.filename || 'submission.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      },
    });
  }

  giveFeedback(submission: any) {
    let body = {
      feedback: submission.feedback,
      rating: submission.rating,
    };
    let submissionId = submission._id;

 
      this._ReviewService.giveFinalTestFeedback(submissionId,body).subscribe({
        next: (res: any) => {
          console.log('Feedback submitted successfully:', res);
          alert('Feedback submitted successfully!');
          const updated = res.submission;

          // Replace the old submission with the updated one from the server
          const index = this.submissions.findIndex(
            (s) => s._id === updated._id
          );
          if (index !== -1) {
            this.submissions[index] = updated;
          }
        },
        error: (err) => {
          console.error('Error submitting feedback:', err);
          alert(err.error?.message || 'Failed to submit feedback.');
        },
      });
  }
}
