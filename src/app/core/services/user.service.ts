import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _HttpClient = inject(HttpClient);

  private BaseUrl = 'https://education-platform-back-end.vercel.app';
  // BaseUrl:string="http://localhost:3000"
  

  name = signal<string | undefined>(undefined);
  setName(name: string| undefined) {
    this.name.set(name);
  }
  profileImage = signal<string | null>(null);
  setProfileImage(url: string|null) {
    this.profileImage.set(url);
  }

  email = signal<string | null>(null);
  setEmail(email: string) {
    this.email.set(email);
  }

  
  score = signal<number | undefined>(undefined);
  setScore(score: number|undefined) {
    this.score.set(score);
  }



  Register(userData: any): Observable<any> {
    return this._HttpClient.post(`${this.BaseUrl}/user/`, userData);
  }

  Login(userData: any): Observable<any> {
    return this._HttpClient.post(`${this.BaseUrl}/user/login`, userData);
  }
  updateUserData(body: any): Observable<any> {
    return this._HttpClient.patch(`${this.BaseUrl}/user/`, body);
  }

  uploadProfilePic(formData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.BaseUrl}/user/profile`, formData);
  }
  getProfile(): Observable<any> {
    return this._HttpClient.get(`${this.BaseUrl}/user/`);
  }

  getAssignmentsFeedbacks(): Observable<any> {
    return this._HttpClient.get(
      `${this.BaseUrl}/submittedAssignment/submissions`
    );
  }
  getFinalTestsFeedbacks(): Observable<any> {
    return this._HttpClient.get(`${this.BaseUrl}/finalTest/feedback`);
  }
}
