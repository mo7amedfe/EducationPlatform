import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private _HttpClient = inject(HttpClient);

  baseUrl: string = 'https://education-platform-back-end.vercel.app';

  getAllcourses(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/course/`);
  }

  getSubscribedCourses(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/order/enrolled-courses`);
  }
}
