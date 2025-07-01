import { UserService } from './user.service';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './decoded-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _UserService=inject(UserService)

  isLogin = signal<boolean>(false);
  setIsLogin(state: boolean) {
    this.isLogin.set(state);
  }

  role = signal<string | null>(null);
  setRole(newRole: string | null) {
    this.role.set(newRole);
  }

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
 
      const token = this.getToken();
      const isLoggedIn = !!token;
      this.setIsLogin(isLoggedIn);
      if (isLoggedIn) {
        const decodedToken = this.getDecodedToken();
        this._UserService.name.set(decodedToken?.username)
        if (decodedToken && decodedToken.role === 'Admin') {
          this.setRole('Admin');
        } else if (decodedToken && decodedToken.role === 'Instructor') {
          this.setRole('Instructor');
        } else {
          this.setRole('Student');
        }
      } else {
        this.setRole(null);
      }
 
  }

  getToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }
}
