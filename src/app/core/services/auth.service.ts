import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { DecodedToken } from './decoded-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdmin.asObservable();

  isInstructor = new BehaviorSubject<boolean>(false);
  isInstructor$ = this.isInstructor.asObservable();

  isLogin = new BehaviorSubject<boolean>(false);
  isLogin$ = this.isLogin.asObservable();

  getDecodedToken(): DecodedToken | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return jwtDecode(token);
      }
    }
    return null;
  }

  checkLoginStatus() {
    if (typeof window !== 'undefined') {
      const token = this.getToken();
      const isLoggedIn = !!token;
      this.setIsLogin(isLoggedIn);
      if (isLoggedIn) {
        const decodedToken = this.getDecodedToken();
        if (decodedToken && decodedToken.role === 'Admin') {
          this.setIsAdmin(true);
          this.setIsInstructor(false);
        } else if (decodedToken && decodedToken.role === 'Instructor') {
          this.setIsAdmin(false);
          this.setIsInstructor(true);
        } else {
          this.setIsAdmin(false);
          this.setIsInstructor(false);
        }
      } else {
        this.setIsAdmin(false);
        this.setIsInstructor(false);
          console.log(this.isAdmin.getValue());
      }
    } else {
      this.setIsLogin(false);
    }
  }

  setIsLogin(state: boolean) {
    this.isLogin.next(state);
    if (!state) {
      this.setIsAdmin(state)
      this.setIsInstructor(state)
    }
  }
  setIsAdmin(state: boolean) {
    this.isAdmin.next(state);
  }
  setIsInstructor(state: boolean) {
    this.isInstructor.next(state);
  }

  getToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

}
