import { AuthService } from '../../core/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) { }

  private BaseUrl = 'http://localhost:3000';

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

    const token = this._AuthService.getToken();

    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    
    return this._HttpClient.patch(`${this.BaseUrl}/user/`, body, { headers })
  }

  uploadProfilePic(formData: FormData): Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.BaseUrl}/user/profile`, formData, { headers });
  }
  getProfile(): Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.BaseUrl}/user/`, { headers })
  }
  // getCart():Observable<any>{
  //   const token = this._AuthService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this._HttpClient.get(`${this.BaseUrl}/user/cart`, { headers })
  // }
}
