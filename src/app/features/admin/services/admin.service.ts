import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _HttpClient = inject(HttpClient);

  baseUrl: string = 'https://education-platform-back-end.vercel.app';

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

  // addLessonWithMedia(lessonData: any, videoFile: File | null, assignmentData: any, assignmentFile: File | null): Observable<any> {
  //   return this.createLesson(lessonData).pipe(
  //     switchMap((lessonId) =>
  //       this.uploadMediaFiles(lessonId, videoFile, assignmentData, assignmentFile).pipe(
  //         map(() => ({
  //           success: true,
  //           message: 'Lesson created with media',
  //           lessonId,
  //         }))
  //       )
  //     ),
  //     catchError((error) => {
  //       console.error('Error in lesson creation flow:', error);
  //       return of({ success: false, message: 'Lesson creation failed' });
  //     })
  //   );
  // }

  // private createLesson(lessonData: any): Observable<string> {
  //   return this._HttpClient
  //     .post<any>(`${this.baseUrl}/leason/`, lessonData)
  //     .pipe(
  //       map((res) => res.leason._id),
  //       tap((id) => console.log('Lesson created with ID:', id))
  //     );
  // }

  // private uploadMediaFiles(lessonId: string, videoFile: File | null, assignmentData: any, assignmentFile: File | null): Observable<any> {
  //   return this.uploadVideo(lessonId, videoFile).pipe(
  //     switchMap(() => {
  //       if (assignmentFile && assignmentData) {
  //         return this.uploadAssignment(lessonId, assignmentData, assignmentFile);
  //       }
  //       return of(null);
  //     })
  //   );
  // }

  // private uploadVideo(lessonId: string,videoFile: File | null): Observable<any> {
  //   if (!videoFile) return of(null);

  //   const formData = new FormData();
  //   formData.append('video', videoFile);

  //   return this._HttpClient.post(`${this.baseUrl}/leason/${lessonId}/video`, formData)
  //     .pipe(
  //       tap((res) => console.log('Video uploaded:', res)),
  //       catchError((err) => {
  //         console.error('Video upload failed:', err);
  //         return of(null);
  //       })
  //     );
  // }

  // private uploadAssignment(lessonId: string, assignmentData: any, assignmentFile: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('assignmentFile', assignmentFile);
  //   formData.append('title', assignmentData.title);
  //   formData.append('description', assignmentData.description);
  //   formData.append('dueDate', assignmentData.dueDate);

  //   return this._HttpClient.post(
  //     `${this.baseUrl}/leason/${lessonId}/assignment`,
  //     formData
  //   );
  // }

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
