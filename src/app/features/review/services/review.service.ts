import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _HttpClient = inject(HttpClient);

  getFinalTestSubmissions(): Observable<any> {
    return this._HttpClient.get('http://localhost:3000/finalTest/review');
  }
  downloadFinalTestSubmission(submissionId: any): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:3000/finalTest/submission/${submissionId}/download`,
      {
        responseType: 'blob',
      }
    );
  }
  giveFinalTestFeedback(submissionId: any, body: any): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:3000/finalTest/${submissionId}/grade`,
      body
    );
  }

  getAssignmentsSubmissions(): Observable<any> {
    return this._HttpClient.get(
      'http://localhost:3000/submittedAssignment/review'
    );
  }
  giveAssignmentFeedback(submissionId: any, body: any): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:3000/submittedAssignment/${submissionId}/grade`,
      body
    );
  }
  downloadAssignmentSubmission(submissionId: any): Observable<any> {
    return this._HttpClient.get(`http://localhost:3000/submittedAssignment/${submissionId}/download`,
      { responseType: 'blob' }
    );
  }
}
