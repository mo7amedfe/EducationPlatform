import { CartService } from './../../core/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any = {
    courses: [],
    total: 0,
  };
  loading: boolean = true;
  showSuccessMessage: boolean = false;
  orderNumber: string = '';

  constructor(private CartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.CartService.getCart().subscribe({
      next: (response: any) => {
        this.cart = response.cart;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      },
    });
  }

  removeFromCart(courseId: string) {
    this.CartService.deleteCourse(courseId).subscribe({
      next: (response: any) => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error removing item:', error);
      },
    });
  }

  clearCart() {
    this.CartService.clearCart().subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      },
    });
  }

  checkout() {
    this.CartService.checkout(this.cart._id,"card").subscribe({
      next: (response: any) => {

        this.showSuccessMessage = true;

      },
      error: (error) => {
        console.error('Error checking out:', error);
      },
    });
  }
}