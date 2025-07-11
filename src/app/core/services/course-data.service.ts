import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseDataService {
  constructor(private _HttpClient: HttpClient) {}

  baseUrl: string = 'https://education-platform-back-end.vercel.app';
  // baseUrl:string="http://localhost:3000"


  getCourseData(courseId: string) {
    return this._HttpClient.get(`${this.baseUrl}/leason/course/${courseId}`);
  }
  getLessonAssignment(lessonId: string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/leason/${lessonId}/assignment/download`
    );
  }
  uploadAssignment(selectedLessonId: any, formData: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/submittedAssignment/${selectedLessonId}/submissions`,
      formData
    );
  }
  dowmloadSubmission(submissionId: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/submittedAssignment/my-submissions/${submissionId}/download`
    );
  }
  downloadCourseFinalTest(courseId: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/finalTest/course/${courseId}/file`
    
    );
  }
  uploadFinalTest(courseId: any, formData: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/finalTest/course/${courseId}/submit`,
      formData
    );
  }
}
