
// import { CartService } from './../cart.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from './../../core/services/cart.service';
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

  newComment: string = '';

  // Static comments for testing
  comments = [
    {
      userName: 'Sarah Johnson',
      userAvatar: 'assets/images/avatar-3814049_1280.png',
      text: 'This course exceeded my expectations! The content is well-structured and the instructor explains everything clearly. Highly recommended for beginners.',
      date: new Date('2024-03-15T10:30:00'),
      likes: 12,
    },
    {
      userName: 'Michael Chen',
      userAvatar: 'assets/images/avatar-3814049_1280.png',
      text: "The practical examples are really helpful. I've learned a lot of new techniques that I can apply to my projects immediately.",
      date: new Date('2024-03-14T15:45:00'),
      likes: 8,
    },
    {
      userName: 'Emma Wilson',
      userAvatar: 'assets/images/avatar-3814049_1280.png',
      text: 'Great course! The step-by-step approach makes it easy to follow along. Would love to see more advanced topics in the future.',
      date: new Date('2024-03-13T09:15:00'),
      likes: 15,
    },
    {
      userName: 'David Brown',
      userAvatar: 'assets/images/avatar-3814049_1280.png',
      text: "The course materials are comprehensive and the support is excellent. I've been able to solve all my doubts through the comments section.",
      date: new Date('2024-03-12T14:20:00'),
      likes: 6,
    },
    {
      userName: 'Lisa Anderson',
      userAvatar: 'assets/images/avatar-3814049_1280.png',
      text: 'I appreciate how the instructor breaks down complex concepts into manageable chunks. The quizzes after each section are really helpful for retention.',
      date: new Date('2024-03-11T11:00:00'),
      likes: 9,
    },
  ];

  isInCart: boolean = false;

  totalHours = 24;
  startDate = new Date('2024-07-01');
  endDate = new Date('2024-08-12');

  showMessage: boolean = false;
  message: string = '';

  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _HttpClient: HttpClient,
    private CartService: CartService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = idParam;
    }

    this._HttpClient.get('http://localhost:3000/course/').subscribe({
      next: (res) => {
        console.log(res);
        
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
    this.CartService.getCart().subscribe({
      next: (response: any) => {
        this.isInCart = response.cart.courses.some((item: any) => 
          item.courseId?._id === this.id
        );
      }
    });
  }

  submitComment() {
    if (this.newComment.trim()) {
      this.comments.unshift({
        userName: 'Current User',
        userAvatar: 'assets/images/avatar-3814049_1280.png',
        text: this.newComment,
        date: new Date(),
        likes: 0,
      });
      this.newComment = '';
    }
  }

  addToCart(schedule: any, courseId: string) {
    this.CartService.addToCart(schedule, courseId).subscribe({
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
