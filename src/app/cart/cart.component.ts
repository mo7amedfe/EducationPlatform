import { CartService } from './../cart.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
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
        console.log(this.cart);
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
        console.log(response);

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
        this.loadCart(); // Reload cart after clearing
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      },
    });
  }

  getScheduleTime(scheduleId: string, schedules: any[]): string {
    const found = schedules?.find((s) => s._id === scheduleId);
    return found ? found.schedule : 'N/A';
  }

  getSelectedSchedule(item: any): string {
    if (!item?.scheduleId || !item?.courseId?.schedules) return 'N/A';
    const found = item.courseId.schedules.find(
      (s: any) => s._id === item.scheduleId
    );
    return found ? found.schedule : 'N/A';
  }
  checkout() {
    this.CartService.checkout(this.cart._id,"card").subscribe({
      next: (response: any) => {
        console.log(response);
        this.showSuccessMessage = true;
        this.orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Hide success message after 3 seconds and redirect
        // setTimeout(() => {
        //   this.showSuccessMessage = false;
        //   this.loadCart();
        // }, 3000);
      },
      error: (error) => {
        console.error('Error checking out:', error);
      },
    });
  }
}