import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private _HttpClient = inject(HttpClient);

  baseUrl: string = 'http://localhost:3000';

  getAllcourses(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/course/`);
  }

  getSubscribedCourses(): Observable<any> {
    return this._HttpClient.get('http://localhost:3000/order/enrolled-courses');
  }
}
