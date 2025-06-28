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
    return this._HttpClient.post(
      'http://localhost:3000/cart/addToCart',
      { schedule, courseId },
    );
  }
  getCart():Observable<any> {
    return this._HttpClient.get('http://localhost:3000/cart/getCart');
  }
  deleteCourse(courseId:any):Observable<any> {
    const body = {courseId:courseId};
    return this._HttpClient.delete("http://localhost:3000/cart/course",{body});
  }
  clearCart():Observable<any> {
    return this._HttpClient.delete("http://localhost:3000/cart/clear");
  }

  checkout(cartId:any,paymentMethod:any):Observable<any> {
    const body = {
      "cartId": cartId,
      "paymentMethod": paymentMethod,
    };
    return this._HttpClient.post("http://localhost:3000/order",body);
  }
}
