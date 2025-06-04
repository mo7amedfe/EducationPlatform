import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseDataService {

  constructor(private _HttpClient: HttpClient,private _AuthService:AuthService) { }

  baseUrl:string="http://localhost:3000"

  getCourseData(courseId: string) {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseUrl}/leason/course/${courseId}`, { 
      headers 
    });
  }
}
