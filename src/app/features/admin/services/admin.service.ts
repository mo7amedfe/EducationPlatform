import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _HttpClient = inject(HttpClient);

  // baseUrl: string = 'https://education-platform-back-end.vercel.app';
  baseUrl:string="http://localhost:3000"

  getAllUsers(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/user/allUsers`);
  }

  DeleteUser(body: any): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/user/deleteUser`, body);
  }
  addCourse(courseData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/course/`, courseData);
  }
  postSchedule(schedule: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/schedule/`, {
      schedule,
    });
  }
  AddImageToCourse(courseId: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('courseimage', imageFile);
    return this._HttpClient.post(
      `${this.baseUrl}/course/courseCover`,
      formData
    );
  }

  createLesson(lessonData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/leason/`, lessonData);
  }
  AddAssignmentToLesson(
    assignmentData: any,
    lessonId: string
  ): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/leason/${lessonId}/submit`,
      assignmentData
    );
  }
  addVideoToLesson(videoFile: any, lessonId: string): Observable<any> {
    const formData = new FormData();
    formData.append('video', videoFile);

    return this._HttpClient.post(
      `${this.baseUrl}/leason/${lessonId}/video`,
      formData
    );
  }

  addFinalTest(
    selectedCourseForFinalTestId: any,
    formData: any
  ): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/finalTest/course/${selectedCourseForFinalTestId}/create`,
      formData
    );
  }

  deleteCourse(selectedDeleteCourseId: any): Observable<any> {
    return this._HttpClient.delete(
      `${this.baseUrl}/course/${selectedDeleteCourseId}`
    );
  }
}
