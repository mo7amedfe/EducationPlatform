import { inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private _HttpClient = inject(HttpClient)

  private BaseUrl = 'https://education-platform-back-end.vercel.app';

  profileImage = new BehaviorSubject<any>(null)
  $profileImage = this.profileImage.asObservable()
  setProfileImage(url: string) {
    this.profileImage.next(url)
  }
  name = new BehaviorSubject<any>(null)
  $name = this.name.asObservable()
  setname(url: string) {
    this.name.next(url)
    console.log(url);
    
  }


  email = new BehaviorSubject<any>(null)
  $email = this.email.asObservable()
  setEmail(url: string) {
    this.email.next(url)
    console.log(url);

  }
  score = new BehaviorSubject<any>(null)
  $score = this.score.asObservable()
  setScore(score: any) {
    this.score.next(score)
    console.log(score);
    
  }

  Register(userData: any): Observable<any> {
    return this._HttpClient.post(`${this.BaseUrl}/user/`, userData);
  }
  
  Login(userData: any): Observable<any> {
    return this._HttpClient.post(`${this.BaseUrl}/user/login`, userData);


  }
  updateUserData(body: any): Observable<any> {

    
    return this._HttpClient.patch(`${this.BaseUrl}/user/`, body)
  }

  uploadProfilePic(formData: FormData): Observable<any> {

    return this._HttpClient.post(`${this.BaseUrl}/user/profile`, formData);
  }
  getProfile(): Observable<any> {

    return this._HttpClient.get(`${this.BaseUrl}/user/`)
  }

  getAssignmentsFeedbacks():Observable<any>{
   return this._HttpClient.get(`${this.BaseUrl}/submittedAssignment/submissions`)
  }
  getFinalTestsFeedbacks():Observable<any>{
    return this._HttpClient.get(`${this.BaseUrl}/finalTest/feedback`)
   }
}
