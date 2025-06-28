import { AuthService } from './../../../core/services/auth.service';
import { HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FinalTestReviewComponent } from '../final-test-review/final-test-review.component';

@Component({
  selector: 'app-students-assignments',
  templateUrl: './students-assignments.component.html',
  styleUrls: ['./students-assignments.component.css'],
  imports: [CommonModule, FormsModule, FinalTestReviewComponent]
})
export class StudentsAssignmentsComponent implements OnInit {
  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {}

  submissions: any[] = [];
  selectedCourse: string = '';
  uniqueCourses: string[] = [];
  isLoading = true;

  ngOnInit(): void {
    const token = this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient.get('http://localhost:3000/submittedAssignment/review', { headers })
      .subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          this.submissions = Array.isArray(res.submissions) ? res.submissions : [];
          this.extractUniqueCourses();
          this.isLoading = false;
        },
        error: (err:any) => {
          this.isLoading = false;
        }
      });
  }

  extractUniqueCourses(): void {
    const courses = this.submissions
      .map(sub => sub.lessonId?.courseId?.title)
      .filter((title, index, self) => title && self.indexOf(title) === index);
    this.uniqueCourses = courses;
  }

  filteredSubmissions(): any[] {
    if (!this.selectedCourse) {
      return this.submissions;
    }
    return this.submissions.filter(
      sub => sub.lessonId?.courseId?.title === this.selectedCourse
    );
  }

giveFeedback(submission: any) {
  const token = this._AuthService.getToken?.() || localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  if (submission.rating < 0 || submission.rating > 5) {
    alert('Rating must be between 0 and 5');
    return;
  }

  const body = {
    feedback: submission.feedback,
    rating: submission.rating,
    submissionId: submission._id
  };

  this._HttpClient
    .post(`http://localhost:3000/submittedAssignment/${submission._id}/grade`, body, { headers })
    .subscribe({
      next: (res: any) => {
        console.log('Feedback submitted successfully:', res);
        alert('Feedback submitted successfully!');
        const updated = res.submission;

        // Replace the old submission with the updated one from the server
        const index = this.submissions.findIndex(s => s._id === updated._id);
        if (index !== -1) {
          this.submissions[index] = updated;
        }
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert(err.error?.message || 'Failed to submit feedback.');
      }
    });
}
  downloadSubmission(submission_id: string) {

    // Example: get token from AuthService or localStorage
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this._HttpClient
      .get(`http://localhost:3000/submittedAssignment/${submission_id}/download`,
        { headers, responseType: 'blob' }
      )
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response]);
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `submission_${submission_id}.pdf`;
          a.click();

          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading submission:', err);
          alert('Failed to download submission. Please try again later.');
        },
      });
  }

}
