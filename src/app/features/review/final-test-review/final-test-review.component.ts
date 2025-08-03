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
  selectedStatus: string = ''; // Add status filter
  isLoading = true;
  isLoadingFeedback = false;
  isDownloadingSubmission = false;
  errorMessage = '';
  hasError = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.loadSubmissions();
  }

  loadSubmissions() {
    this._ReviewService.getFinalTestSubmissions().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        
        try {
          // Handle the new object structure
          if (res && Array.isArray(res.submissions)) {
            this.allSubmissions = res.submissions;
          } else if (Array.isArray(res)) {
            this.allSubmissions = res;
          } else {
            throw new Error('Invalid response format');
          }

          console.log('All Submissions:', this.allSubmissions);

          // Extract unique courses from the new structure
          const courseMap: { [key: string]: string } = {};
          this.allSubmissions.forEach((sub: any) => {
            if (sub.courseId && sub.courseName) {
              courseMap[sub.courseId] = sub.courseName;
            }
          });

          this.courses = Object.entries(courseMap).map(
            ([courseId, courseName]) => ({ courseId, courseName })
          );

          if (this.courses.length > 0) {
            this.selectedCourse = '';
            this.updateSubmissions();
          }
          
          this.isLoading = false;
          this.hasError = false;
        } catch (error) {
          console.error('Error processing submissions:', error);
          this.handleError('Failed to process submissions data');
        }
      },
      error: (err) => {
        console.error('Error fetching submissions:', err);
        this.handleError('Failed to load submissions. Please try again later.');
      },
    });
  }

  updateSubmissions() {
    let filteredSubmissions = this.allSubmissions;
    
    // Filter by course
    if (this.selectedCourse) {
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => sub.courseId === this.selectedCourse
      );
    }
    
    // Filter by status
    if (this.selectedStatus) {
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => sub.status === this.selectedStatus
      );
    }
    
    this.submissions = filteredSubmissions;
  }

  onCourseChange() {
    this.updateSubmissions();
  }

  onStatusChange() {
    this.updateSubmissions();
  }

  onStatusCheckboxChange(status: string) {
    this.selectedStatus = status;
    this.updateSubmissions();
  }

  downloadSubmission(submission: any) {
    if (this.isDownloadingSubmission) return;
    
    this.isDownloadingSubmission = true;
    const submissionId = submission.id || submission._id;
    
    this._ReviewService.downloadFinalTestSubmission(submissionId).subscribe({
      next: (blob) => {
        try {
          const file = new Blob([blob], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
      
          // Create descriptive filename
          const filename = `final-test-submission-${submission.studentName || 'student'}-${submission.courseName || 'course'}.pdf`;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('Error creating download:', error);
          this.handleError('Failed to create download file');
        } finally {
          this.isDownloadingSubmission = false;
        }
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        this.handleError('Failed to download submission. Please try again later.');
        this.isDownloadingSubmission = false;
      }
    });
  }
  
  giveFeedback(submission: any) {
    if (this.isLoadingFeedback) return;
    
    this.isLoadingFeedback = true;
    
    // Validate rating
    if (!submission.rating || submission.rating < 1 || submission.rating > 5) {
      this.handleError('Rating must be between 1 and 5');
      this.isLoadingFeedback = false;
      return;
    }

    // Validate feedback
    if (!submission.feedback || submission.feedback.trim() === '') {
      this.handleError('Please provide feedback');
      this.isLoadingFeedback = false;
      return;
    }

    let body = {
      feedback: submission.feedback,
      rating: submission.rating,
    };
    let submissionId = submission.id || submission._id;

    this._ReviewService.giveFinalTestFeedback(submissionId, body).subscribe({
      next: (res: any) => {
        console.log('Feedback submitted successfully:', res);
        this.isLoadingFeedback = false;
        
        try {
          const updated = res.submission || res;
          
          // Replace the old submission with the updated one from the server
          const index = this.submissions.findIndex(
            (s) => (s.id || s._id) === (updated.id || updated._id)
          );
          if (index !== -1) {
            this.submissions[index] = updated;
          }
          
          // Also update in allSubmissions
          const allIndex = this.allSubmissions.findIndex(
            (s) => (s.id || s._id) === (updated.id || updated._id)
          );
          if (allIndex !== -1) {
            this.allSubmissions[allIndex] = updated;
          }
          
          this.hasError = false;
          this.errorMessage = '';
        } catch (error) {
          console.error('Error updating submission:', error);
          this.handleError('Feedback submitted but failed to update display');
        }
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.handleError(err.error?.message || 'Failed to submit feedback');
        this.isLoadingFeedback = false;
      },
    });
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.hasError = true;
    this.isLoading = false;
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.hasError = false;
      this.errorMessage = '';
    }, 5000);
  }

  // Helper methods for template
  isDownloading(): boolean {
    return this.isDownloadingSubmission;
  }

  isSubmittingFeedback(): boolean {
    return this.isLoadingFeedback;
  }

  hasErrorMessage(): boolean {
    return this.hasError && this.errorMessage !== '';
  }
}
