import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { DecodedToken } from './decoded-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLogin = new BehaviorSubject<boolean>(false);
  isLogin$ = this.isLogin.asObservable()

  getDecodedToken() :DecodedToken|null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return jwtDecode(token);
      }
    }
    return null;
  }

  checkLoginStatus() {
    const token = this.getToken();
    const isLoggedIn = !!token;
    this.setIsLogin(isLoggedIn);
  }
  setIsLogin(state: boolean) {
    this.isLogin.next(state);
  }
  getToken() {
    return localStorage.getItem('token') || '';
  }

}
