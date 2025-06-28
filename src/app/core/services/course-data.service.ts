import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseDataService {
  constructor(private _HttpClient: HttpClient) {}

  baseUrl: string = 'http://localhost:3000';

  getCourseData(courseId: string) {
    return this._HttpClient.get(`${this.baseUrl}/leason/course/${courseId}`);
  }
  getLessonAssignment(lessonId: string): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:3000/leason/${lessonId}/assignment/download`,
      {
        responseType: 'blob' as 'blob',
      }
    );
  }
  uploadAssignment(selectedLessonId: any, formData: any): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:3000/submittedAssignment/${selectedLessonId}/submissions`,
      formData
    );
  }
  dowmloadSubmission(submissionId: any): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:3000/submittedAssignment/my-submissions/${submissionId}/download`,
      { responseType: 'blob' }
    );
  }
  downloadCourseFinalTest(courseId: any): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:3000/finalTest/course/${courseId}/file`,
      {
        responseType: 'blob',
      }
    );
  }
  uploadFinalTest(courseId: any, formData: any): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:3000/finalTest/course/${courseId}/submit`,
      formData
    );
  }
}
