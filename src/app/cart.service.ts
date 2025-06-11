import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _AuthService: AuthService,
    private _HttpClient: HttpClient
  ) {
    // Load cart from localStorage on service initialization
  }

  // Get cart items as observable
  getCartItems() {
    // return this.cartItems.asObservable();
  }

  // Add item to cart
  addToCart(schedule: any, courseId: any) {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(
      'http://localhost:3000/cart/addToCart',
      { schedule, courseId },
      { headers }
    );
  }
  getCart():Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get('http://localhost:3000/cart/getCart', {headers});
  }
  deleteCourse(courseId:any):Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {courseId:courseId};
    return this._HttpClient.delete("http://localhost:3000/cart/course",{body,headers});
  }
  clearCart():Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete("http://localhost:3000/cart/clear",{headers});
  }

  checkout(cartId:any,paymentMethod:any):Observable<any> {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      "cartId": cartId,
      "paymentMethod": paymentMethod,
    };
    return this._HttpClient.post("http://localhost:3000/order",body,{headers});
  }
}
