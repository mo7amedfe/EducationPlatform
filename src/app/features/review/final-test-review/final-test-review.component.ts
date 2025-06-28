import { AuthService } from './../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-final-test-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './final-test-review.component.html',
  styleUrl: './final-test-review.component.css'
})
export class FinalTestReviewComponent implements OnInit {
  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) { }

  allSubmissions: any[] = [];
  submissions: any[] = [];
  courses: { courseId: string, courseName: string }[] = [];
  selectedCourse: string = '';
  isLoading = true; // Add loading state

  ngOnInit(): void {
    this.isLoading = true; // Set loading to true on init
    this.loadSubmissions();
  }

  loadSubmissions() {
    const token = this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient.get('http://localhost:3000/finalTest/review', { headers })
      .subscribe({
        next: (res: any) => {
          console.log(res);

          // ✅ FIXED: Accept array directly
          this.allSubmissions = res.submissions;
          console.log('All Submissions:', this.allSubmissions);
          // ✅ Extract unique courses
          const courseMap: { [key: string]: string } = {};
          this.allSubmissions.forEach((sub: any) => {
            const course = sub.finalTestId.courseId;
            courseMap[course._id] = course.title;
          });

          this.courses = Object.entries(courseMap).map(([courseId, courseName]) => ({ courseId, courseName }));

          if (this.courses.length > 0) {
            this.selectedCourse = this.courses[0].courseId;
            this.selectedCourse = ''; // ✅ Select All Courses by default
            this.updateSubmissions();
          }
          this.isLoading = false; // Set loading to false on data load
        },
        error: (err) => {
          console.error('Error fetching submissions:', err);
          this.isLoading = false; // Set loading to false on error
        }
      });
  }



updateSubmissions() {
  if (!this.selectedCourse) {
    this.submissions = this.allSubmissions;
  } else {
    this.submissions = this.allSubmissions.filter(
      sub => sub.finalTestId.courseId._id === this.selectedCourse
    );
  }
}


  onCourseChange() {
    this.updateSubmissions();
  }

  downloadSubmission(submission: any) {
    const token = this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient.get(`http://localhost:3000/finalTest/submission/${submission._id}/download`, {
      headers,
      responseType: 'blob'
    }).subscribe({
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
      }
    });
  }

  giveFeedback(submission: any) {
    let body = {
    feedback: submission.feedback,
    rating: submission.rating
  };
    const token = this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient.post(`http://localhost:3000/finalTest/${submission._id}/grade`, body, { headers }).subscribe({
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
}
