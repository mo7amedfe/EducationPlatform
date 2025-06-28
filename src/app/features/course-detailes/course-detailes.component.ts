
// import { CartService } from './../cart.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from './../../core/services/cart.service';
import { CoursesService } from '../../core/services/courses.service';
@Component({
  selector: 'app-course-detailes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-detailes.component.html',
  styleUrl: './course-detailes.component.css',
})
export class CourseDetailesComponent implements OnInit {
  courses: any;
  course: any = {};
  id: any;
  courseSchedules: any[] = [];
  isInCart: boolean = false;
  showMessage: boolean = false;
  message: string = '';
  cartItems: any[] = [];


    private _ActivatedRoute=inject(ActivatedRoute)
    private _CartService=inject(CartService)
    private _CoursesService=inject(CoursesService)



  ngOnInit() {
    const idParam = this._ActivatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = idParam;
    }

    this._CoursesService.getAllcourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.course = this.courses.find((course: any) => course._id === this.id);
        this.checkIfInCart();
        this.courseSchedules = this.course.schedules;
        console.log('Course Schedules:', this.courseSchedules);
        console.log('Course Details:', this.course);
      },
    });

    this.loadCart();
  }

  loadCart() {
    this._CartService.getCart().subscribe({
      next: (response: any) => {
        this.isInCart = response.cart.courses.some((item: any) => 
          item.courseId?._id === this.id
        );
      }
    });
  }


  addToCart(schedule: any, courseId: string) {
    this._CartService.addToCart(schedule, courseId).subscribe({
      next: (response) => {
        this.showMessage = true;
        this.message = 'Course added to cart successfully!';
        this.isInCart = true;

        // Hide message after 3 seconds
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      },
      error: (error) => {
        this.showMessage = true;
        this.message = 'Error adding course to cart';
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
    });
  }

  private checkIfInCart() {
      // this.CartService.getCartItems().subscribe((items) => {
      //   this.isInCart = items.some((item) => item._id === this.course._id);
      // });
  }
}
