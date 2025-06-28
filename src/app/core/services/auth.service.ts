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
          console.log(this.isAdmin.getValue());
        } else {
          this.setIsAdmin(false);
          console.log(this.isAdmin.getValue());

        }
      } else {
        this.setIsAdmin(false);
          console.log(this.isAdmin.getValue());

      }
    } else {
      this.setIsLogin(false);
    }
  }

  setIsLogin(state: boolean) {
    this.isLogin.next(state);
  }
  setIsAdmin(state: boolean) {
    this.isAdmin.next(state);
  }

  getToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

}
