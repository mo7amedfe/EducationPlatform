import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _HttpClient = inject(HttpClient);
  // baseUrl: string = 'https://education-platform-back-end.vercel.app';
  baseUrl:string="http://localhost:3000"

  getFinalTestSubmissions(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/finalTest/review`);
  }
  downloadFinalTestSubmission(submissionId: any): Observable<Blob> {
    return this._HttpClient.get(
      `${this.baseUrl}/finalTest/submission/${submissionId}/download`,
      { responseType: 'blob' }
    );
  }
  giveFinalTestFeedback(submissionId: any, body: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/finalTest/${submissionId}/grade`,
      body
    );
  }

  getAssignmentsSubmissions(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/submittedAssignment/review`);
  }
  giveAssignmentFeedback(submissionId: any, body: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/submittedAssignment/${submissionId}/grade`,
      body
    );
  }
  downloadAssignmentSubmission(submissionId: any): Observable<Blob> {
    return this._HttpClient.get(
      `${this.baseUrl}/submittedAssignment/${submissionId}/download`, { responseType: 'blob' }
    );
  }
}
