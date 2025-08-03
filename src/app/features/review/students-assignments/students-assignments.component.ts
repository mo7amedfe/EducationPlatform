import { ReviewService } from './../services/review.service';
import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinalTestReviewComponent } from '../final-test-review/final-test-review.component';

@Component({
  selector: 'app-students-assignments',
  templateUrl: './students-assignments.component.html',
  styleUrls: ['./students-assignments.component.css'],
  imports: [CommonModule, FormsModule, FinalTestReviewComponent],
})
export class StudentsAssignmentsComponent implements OnInit {

  submissions: any[] = [];
  selectedCourse: string = '';
  selectedStatus: string = ''; // Add status filter
  uniqueCourses: string[] = [];
  isLoading = true;
isLoadingFeedback = false;
  private _ReviewService = inject(ReviewService);

  ngOnInit(): void {
    this._ReviewService.getAssignmentsSubmissions().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        this.submissions = Array.isArray(res.submissions)
          ? res.submissions
          : [];
        this.extractUniqueCourses();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
    });
  }

  extractUniqueCourses(): void {
    const courses = this.submissions
      .map((sub) => sub.lessonId?.courseId?.title)
      .filter((title, index, self) => title && self.indexOf(title) === index);
    this.uniqueCourses = courses;
  }

  filteredSubmissions(): any[] {
    let filteredSubmissions = this.submissions;
    
    // Filter by course
    if (this.selectedCourse) {
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => sub.lessonId?.courseId?.title === this.selectedCourse
      );
    }
    
    // Filter by status
    if (this.selectedStatus) {
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => sub.status === this.selectedStatus
      );
    }
    
    return filteredSubmissions;
  }

  giveFeedback(submission: any) {
    this.isLoadingFeedback = true;
    let submissionId = submission._id;

    if (submission.rating < 0 || submission.rating > 5) {
      alert('Rating must be between 0 and 5');
      return;
    }

    const body = {
      feedback: submission.feedback,
      rating: submission.rating,
      submissionId: submission._id,
    };

    this._ReviewService.giveAssignmentFeedback(submissionId, body).subscribe({
      next: (res: any) => {
        console.log('Feedback submitted successfully:', res);
        this.isLoadingFeedback = false;

        const updated = res.submission;

        // Replace the old submission with the updated one from the server
        const index = this.submissions.findIndex((s) => s._id === updated._id);
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

  onStatusCheckboxChange(status: string) {
    this.selectedStatus = status;
  }
  downloadSubmission(submission_id: string) {
    this._ReviewService.downloadAssignmentSubmission(submission_id).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        const submission = this.submissions.find((s) => s._id === submission_id);
  
        link.download = `Assignment-submission ${submission?.userId?.username}-${submission?.lessonId?.title}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Error downloading submission:', err);
        alert('Failed to download submission. Please try again later.');
      },
    });
  }
  

}
